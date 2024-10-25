import { currentLoad, networkInterfaceDefault, networkStats } from "systeminformation"
import { collector } from "./src/collector"
import type { GlobalConf, oneTimeDataType, uploadDataType } from "./src/type"
import { startTimer } from "./src/dataUpdater"

const env = Bun.env
const args = require('minimist')(Bun.argv)

export const GlobalConfiguration: GlobalConf = {
    remote: env.REMOTE || args.r || args.remote || 'ws://127.0.0.0:9702/',
    key: env.KEY || args.k || args.key || 'oATqKPjF72wau8MdJPhV',
    name: env.NAME || args.n || args.name || 'Infra',
    updInterval: env.UPI || args.u || args.updateinterval || 1.2
}


const IPandLoc = await (await fetch('http://ip-api.com/json')).json()


export const oneTimeData: oneTimeDataType = {
    countryCode: IPandLoc.countryCode
}

await startTimer()

// Create WebSocket channel

const wsSocket = new WebSocket(GlobalConfiguration.remote)

setInterval(async () => {
    wsSocket.send(JSON.stringify(collector()))
}, GlobalConfiguration.updInterval * 1000)