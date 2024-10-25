// Real Time Data Monitor
import { networkInterfaceDefault, currentLoad, networkStats, fsSize, mem } from "systeminformation";
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
    free: 0,
    occu: 0
};
// Mem
export let RTMem: uploadDataType['mem'] = {
    onboard: {
        free: 0,
        occu: 0
    },
    swap: {
        free: 0,
        occu: 0
    }
}


export const startTimer = async () => {

    // Runtime Conf
    const mainInterface = await networkInterfaceDefault();

    setInterval(async () => {
        // CPU
        RTcpu = (await currentLoad()).currentLoad;
        // NetFlow
        const data = (await networkStats()).find((nw) => nw.iface === mainInterface)
        RTNetFlow = {
            total: {
                up: data?.rx_bytes || 0,
                down: data?.tx_bytes || 0
            },
            current: {
                up: data?.tx_sec || 0,
                down: data?.rx_sec || 0
            }
        };
        // Storage
        (await fsSize()).forEach((fsObj) => {
            if (doRecordFs.includes(fsObj.type))
                RTstorage = {
                    free: fsObj.available + RTstorage.free,
                    occu: fsObj.used + RTstorage.occu
                };
        });
        // Mem
        const memData = await mem()
        RTMem = {
            onboard: {
                free: memData.available,
                occu: memData.total
            },
            swap: {
                free: memData.swapfree,
                occu: memData.swaptotal
            }
        }
    }, GlobalConfiguration.updInterval * 1000);
}

