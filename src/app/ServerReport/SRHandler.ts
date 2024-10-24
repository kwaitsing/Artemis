import type { Result, Sch2Ts } from "ashes-urn";
import type { SRSchema } from "./SRSchema";
import { servers } from "../..";

class SRHandler {
    pushReport(
        msg: Sch2Ts<typeof SRSchema.msg>
    ) {
        const ts = Math.floor(new Date().getTime() / 1000)
        const index = servers.findIndex((server) => server.name === msg.data.name);
        if (index !== -1) {
            servers[index] = {
                ...msg.data,
                timestamp: ts
            };
        } else {
            servers.push(
                {
                    ...msg.data,
                    timestamp: ts
                }
            );
        }

        return {
            status: 'ok'
        }
    }
}

export default new SRHandler