import type { Sch2Ts } from "ashes-urn";
import type { SRSchema } from "./SRSchema";
import { GlobalConfiguration, servers } from "../..";

class SRHandler {
    pushReport(
        msg: Sch2Ts<typeof SRSchema.msg>
    ) {
        if (msg.key === GlobalConfiguration.key) {
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
        }

    }
}

export default new SRHandler