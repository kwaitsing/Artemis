package main

import (
	"io"
	"net/http"
	"strings"
	"time"

	"github.com/shirou/gopsutil/v4/cpu"
	"github.com/shirou/gopsutil/v4/disk"
	"github.com/shirou/gopsutil/v4/host"
	"github.com/shirou/gopsutil/v4/load"
	"github.com/shirou/gopsutil/v4/mem"
	"github.com/shirou/gopsutil/v4/net"
)

var (
	expectDiskFsTypes = []string{
		"apfs", "ext4", "ext3", "ext2", "f2fs", "reiserfs", "jfs", "btrfs",
		"fuseblk", "zfs", "simfs", "ntfs", "fat32", "exfat", "xfs", "fuse.rclone",
	}
	netInSpeed, netOutSpeed, netInTransfer, netOutTransfer, lastUpdateNetStats uint64
)

func get_location() {
	resp, err := http.Get("https://cloudflare.com/cdn-cgi/trace")

	if err != nil {
		if GlobalConfiguration.Verbose {
			println("Unable to fetch Location: ", err)
		}
	}
	defer resp.Body.Close()
	body, err := io.ReadAll((resp.Body))
	if err != nil {
		if GlobalConfiguration.Verbose {
			println("Unable to fetch Location: ", err)
		}
	}

	lines := strings.Split(string(body), "\n")

	for _, line := range lines {
		if strings.HasPrefix(line, "loc=") {
			parts := strings.Split(line, "=")
			if len(parts) == 2 {
				serverData.Location = parts[1]
			}
		}
	}
}

func getOneTimeData() {
	hi, err := host.Info()
	if err == nil {
		serverData.Uptime = hi.BootTime
	}
}

func collect_data() ServerObj {
	// Update location if your server is in transnia
	if serverData.Location == "trans" {
		get_location()
	}
	if serverData.Uptime == 0 {
		getOneTimeData()
	}

	// Load
	load, err := load.Avg()
	if err == nil {
		serverData.LoadAVG = load.Load1
	}

	// CPU
	cpu, err := cpu.Percent(0, false)
	if err == nil {
		serverData.Cpu = cpu[0]
	}

	// RAM and swap
	vm, err := mem.VirtualMemory()
	if err == nil {
		serverData.Mem.Onboard.Total = vm.Total
		serverData.Mem.Onboard.Used = vm.Total - vm.Available
		serverData.Mem.Swap.Total = vm.SwapTotal
		serverData.Mem.Swap.Used = vm.SwapTotal - vm.SwapFree
	}

	// Storage
	// Credit to https://github.com/nezhahq/agent/blob/134c8c5acb5b1de5ade501e65bd42f2312dc58d9/pkg/monitor/monitor.go#L284C2-L290C3
	devices := make(map[string]string)
	diskList, _ := disk.Partitions(false)
	for _, d := range diskList {
		fsType := strings.ToLower(d.Fstype)
		if devices[d.Device] == "" && ContainsStr(expectDiskFsTypes, fsType) && !strings.Contains(d.Mountpoint, "/var/lib/kubelet") {
			devices[d.Device] = d.Mountpoint
		}
	}
	for _, mountPath := range devices {
		diskUsageOf, err := disk.Usage(mountPath)
		if err == nil {
			serverData.Storage.Total = diskUsageOf.Total
			serverData.Storage.Used = diskUsageOf.Used
		}
	}

	// Network
	mainInterface, err := networkInterfaceDefault()
	nc, err := net.IOCounters(true)
	if err == nil {
		for _, v := range nc {
			if v.Name == mainInterface {
				serverData.Network.Total.Down = v.BytesRecv
				serverData.Network.Total.Up = v.BytesSent
			}
		}
		now := uint64(time.Now().Unix())
		diff := now - lastUpdateNetStats
		if diff > 0 {
			serverData.Network.Current.Down = (serverData.Network.Total.Down - netInTransfer) / diff
			serverData.Network.Current.Up = (serverData.Network.Total.Up - netOutTransfer) / diff
		}
		netInTransfer = serverData.Network.Total.Down
		netOutTransfer = serverData.Network.Total.Up
		lastUpdateNetStats = now
	}

	return serverData
}
