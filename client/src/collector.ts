import { GlobalConfiguration, oneTimeData } from ".."
import OS from 'node:os'
import { RTMem, RTNetFlow, RTcpu, RTstorage } from "./dataUpdater"


export const collector = () => {

    return {
        name: GlobalConfiguration.name,
        location: oneTimeData.countryCode,
        uptime: OS.uptime(),
        loadAVG: OS.loadavg()[0],
        cpu: RTcpu,
        mem: RTMem,
        storage: RTstorage,
        network: RTNetFlow
    }

}