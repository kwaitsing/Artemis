import { URN, type IgniteConf, type Module, type MRequestOPT } from "ashes-urn"
import { logger } from "toolbx"
import { gateway } from "./app/gateway";
import { ServerRoot } from "./app/root/RootModule";

// URN framework exported for other componments
export const urn = new URN({
    enableVerbose: false // Enable verbose on routing
})

// Use args, powered by minimist

const args = urn.args()

// use env

const env = urn.env()

// Database(mongodb+redis)
export const db = await urn.db('mongodb://localhost:27017', 'default') // db as mongodb interface
export const cachedb = await urn.cdb('redis://127.0.0.1:6379') // cdb as redis interface

/**
 * 
 * CheatSheet: Creating a working URN server instance
 * 
 * [createInstance] => loadInstance => igniteInstance
 * 
 */

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
//.use(swagger()); if you wish you can chain more plugins to the instance here

urn.instance = instance // Store the instance back

export type OPT = MRequestOPT<typeof instance['decorator']> // Extract RequestOPT for gateway and Modules

// createInstance => [loadInstance] => igniteInstance
const Modules: Module[] = [
    ServerRoot
]

/**
 * Load route here
 * 
 * The preflightInstance is the instance after the loading stage, preserved for future usage like Eden Treaty
 */
urn.instance = urn.loadInstance(Modules, false, gateway)

/**
 * ref to https://bun.sh/docs/api/http#bun-serve
 */
const serverConf: IgniteConf = {
    hostname: '127.0.0.1', // This can be undefined
    port: 9901
}

urn.igniteInstance(serverConf)

logger(`+ URN running on ${serverConf.hostname}:${serverConf.port}`, 0)