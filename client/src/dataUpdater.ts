// Real Time Data Monitor
import { networkInterfaceDefault, currentLoad, networkStats, fsSize, mem } from "./systeminformation";
import type { uploadDataType } from "./type";
import { GlobalConfiguration } from "..";

const doRecordFs: string[] = [
    "apfs",
    "hfs",
    "ext4",
    "ext3",
    "ext2",
    "f2fs",
    "reiserfs",
    "jfs",
    "btrfs",
    "fuseblk",
    "zfs",
    "simfs",
    "ntfs",
    "fat32",
    "exfat",
    "xfs",
    "fuse.rclone",
]


// Network
export let RTNetFlow: uploadDataType['network'] = {
    total: {
        up: 0,
        down: 0
    },
    current: {
        up: 0,
        down: 0
    }
}
// cpu
export let RTcpu = 0;
// Storage
export let RTstorage: uploadDataType['storage'] = {
    used: 0,
    total: 0
};
// Mem
export let RTMem: uploadDataType['mem'] = {
    onboard: {
        used: 0,
        total: 0
    },
    swap: {
        used: 0,
        total: 0
    }
}


export const startTimer = async () => {

    // Runtime Conf
    const mainInterface = await networkInterfaceDefault();
    // Avoid deadlock
    let isTimerRunning = false;

    const monitor = async () => {

        if (!isTimerRunning) {
            isTimerRunning = true;
            // CPU
            RTcpu = (await currentLoad()).currentLoad;
            // NetFlow
            const data = (await networkStats()).find((nw) => nw.iface === mainInterface)
            if (data) {
                RTNetFlow.total.up = data.tx_bytes;
                RTNetFlow.total.down = data.rx_bytes;
                RTNetFlow.current.up = data.tx_sec;
                RTNetFlow.current.down = data.rx_sec;
            }

            // Storage
            let singleRTStorage = {
                used: 0,
                total: 0
            };
            (await fsSize()).forEach((fsObj) => {
                if (doRecordFs.includes(fsObj.type)) {
                    singleRTStorage.used += fsObj.used
                    singleRTStorage.total += fsObj.size;
                    
                } 
            });
            RTstorage = {
                used: singleRTStorage.used,
                total: singleRTStorage.total
            };
            // Mem
            const memData = await mem()
            RTMem.onboard.used = memData.active;
            RTMem.onboard.total = memData.total;
            RTMem.swap.used = memData.swapused;
            RTMem.swap.total = memData.swaptotal;
            isTimerRunning = false;
        }

        setTimeout(monitor, GlobalConfiguration.updInterval * 1000);
    }

    monitor();
}

