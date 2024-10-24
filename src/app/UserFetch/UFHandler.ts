import type { Result } from "ashes-urn"
import { servers } from "../.."

class UFHandler {
    getServers() {
        let returnObj: Result = {
            status: 'ok',
            data: {
                servers: servers,
                timestamp: Math.floor(new Date().getTime() / 1000)
            }
        }

        return JSON.stringify(returnObj)
    }
}


export default new UFHandler