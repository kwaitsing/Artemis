import { $ } from "bun";
import os from "node:os"
import { GlobalConfiguration } from "..";

const store: {
    cpu: any,
    nw: any
} = {
    cpu: null,
    nw: null
}

export const networkInterfaceDefault = async () => {
    const ifaces = os.networkInterfaces();
    let ifacename = ''
    const cmdReturn = (await $`LC_ALL=C ip route 2> /dev/null | grep default`.text()).split('\n')[0].split(/\s+/)
    if (cmdReturn[0] === 'none' && cmdReturn[5]) {
        ifacename = cmdReturn[5];
    } else if (cmdReturn[4]) {
        ifacename = cmdReturn[4];
    }
    if (ifacename.indexOf(':') > -1) {
        ifacename = ifacename.split(':')[1].trim();
    }
    return ifacename
}

export const currentLoad = async () => {
    const cmdReturn = (await $`cat /proc/stat 2>/dev/null | grep cpu`.text()).split('\n')[0];
    const cpuStats = cmdReturn.split(/\s+/).slice(1, 5).map(Number); // Get user, nice, system, idle
    if (!store.cpu) {
        store.cpu = cpuStats
        return  { currentLoad: 0 };
    }
    const [prevUser, prevNice, prevSystem, prevIdle] = store.cpu;
    const [currUser, currNice, currSystem, currIdle] = cpuStats;

    const deltaUser = currUser - prevUser;
    const deltaNice = currNice - prevNice;
    const deltaSystem = currSystem - prevSystem;
    const deltaIdle = currIdle - prevIdle;

    const totalTime = deltaUser + deltaNice + deltaSystem + deltaIdle;

    store.cpu = cpuStats;

    return {
        currentLoad: (totalTime - deltaIdle) / totalTime * 100
    };
}

export const networkStats = async () => {
    const mainInterface = await networkInterfaceDefault()
    const tx = Number(await $`cat /sys/class/net/${mainInterface}/statistics/tx_bytes`.text())
    const rx = Number(await $`cat /sys/class/net/${mainInterface}/statistics/rx_bytes`.text())
    const returnData = [
        {
            iface: mainInterface,
            tx_bytes: tx,
            rx_bytes: rx,
            tx_sec: store.nw ? (tx - store.nw.tx) / GlobalConfiguration.updInterval : 0,
            rx_sec: store.nw ? (rx - store.nw.rx) / GlobalConfiguration.updInterval : 0
        }
    ]

    store.nw = {
        rx: rx,
        tx: tx
    }
    return returnData
}

export const fsSize = async () => {
    let returnData: {
        used: number,
        size: number,
        type: string
    }[] = []
    const cmdReturn = (await $`LC_ALL=C df -T -B1 -x squashfs`.text()).split('\n').filter(line => line.startsWith('/')).forEach((str) => {
        const parts = str.split(/\s+/);
        returnData.push({
            used: parseInt(parts[3], 10),
            size: parseInt(parts[2], 10),
            type: parts[1]
        })
    })
    
    return returnData
}

export const mem = async () => {
    const cmdReturn = (await $`LC_ALL=C free -b`.text()).split('\n')
    const memLine = cmdReturn[1].split(/\s+/);
    const swapLine = cmdReturn[2].split(/\s+/);

    return {
        total: parseInt(memLine[1]),
        active: parseInt(memLine[1]) - parseInt(memLine[6]), 
        swaptotal: parseInt(swapLine[1]),
        swapused: parseInt(swapLine[2]),
    };
}