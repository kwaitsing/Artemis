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
    console.log(mainInterface)
    // Avoid deadlock
    let isTimerRunning = false;

    setInterval(async () => {

        if (!isTimerRunning) {
            isTimerRunning = true;
            // CPU
            RTcpu = (await currentLoad()).currentLoad;
            // NetFlow
            const data = (await networkStats()).find((nw) => nw.iface === mainInterface)
            RTNetFlow = {
                total: {
                    up: data?.tx_bytes || 0,
                    down: data?.rx_bytes || 0
                },
                current: {
                    up: data?.tx_sec || 0,
                    down: data?.rx_sec || 0
                }
            };
            // Storage
            let singleRTStorage = {
                used: 0,
                total: 0
            };
            (await fsSize()).forEach((fsObj) => {
                if (doRecordFs.includes(fsObj.type))
                    RTstorage = {
                        used: fsObj.used + singleRTStorage.used,
                        total: fsObj.size + singleRTStorage.total
                    };
            });
            // Mem
            const memData = await mem()
            RTMem = {
                onboard: {
                    used: memData.active,
                    total: memData.total
                },
                swap: {
                    used: memData.swapused,
                    total: memData.swaptotal
                }
            }
            isTimerRunning = false;
        }


    }, GlobalConfiguration.updInterval * 1000);
}

