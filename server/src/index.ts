import { URN, type IgniteConf, type Module, type MRequestOPT, type Sch2Ts } from "ashes-urn"
import { logger } from "toolbx"
import { gateway } from "./app/gateway";
import { SRSchema } from "./app/ServerReport/SRSchema";
import SRHandler from "./app/ServerReport/SRHandler";
import type { GlobalConf, serverInStore } from "./type";
import { UserFetch } from "./app/UserFetch/UFDesc";
// URN framework exported for other componments
export const urn = new URN({
    enableVerbose: false // Enable verbose on routing
})

// Use args, powered by minimist

const args = urn.args()

// use env

const env = urn.env()

const GlobalConfiguration: GlobalConf = {
    port: args.p || args.port || Number(env.PORT) || 9702,
    key: args.k || args.key || env.KEY || 'oATqKPjF72wau8MdJPhV'
}

/**
 * 
 * CheatSheet: Creating a working URN server instance
 * 
 * [createInstance] => loadInstance => igniteInstance
 * 
 */

export let servers: serverInStore[] = []

const instance = urn.createInstance()
    .onError(({ code, error, set }) => {
        set.status = 500
        return {
            status: 'er',
            data: {
                msg: 'Invaild request',
                errmsg: JSON.stringify(error),
                code: code
            }
        }
    })
    .ws('/api/v1/upload', {
        body: SRSchema.msg,
        message(ws, body) {
            ws.send(SRHandler.pushReport(body))
        }
    })
//.use(swagger()); if you wish you can chain more plugins to the instance here

urn.instance = instance // Store the instance back

// createInstance => [loadInstance] => igniteInstance
const Modules: Module[] = [
    UserFetch
]

/**
 * Load route here
 * 
 * The preflightInstance is the instance after the loading stage, preserved for future usage like Eden Treaty
 */
urn.loadInstance(Modules, false, gateway)
export type OPT = MRequestOPT<typeof instance['decorator']> // Extract RequestOPT for gateway and Modules

/**
 * ref to https://bun.sh/docs/api/http#bun-serve
 */
const serverConf: IgniteConf = {
    hostname: '0.0.0.0', // This can be undefined
    port: GlobalConfiguration.port
}

urn.igniteInstance(serverConf)

logger(`+ Artemis running on ${serverConf.hostname}:${serverConf.port}`, 0)

export type App = typeof instance