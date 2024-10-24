import type { Sch2Ts } from "ashes-urn"
import type { OPT } from "../.."
import type { postEchoSch } from "./RootSchema"

export const rootHandler = () => {
    return JSON.stringify({
        status: 'ok'
    })
}
export const postEcho = (contents: OPT) => {
    // Use Type assertion and Sch2Ts for the type of ur body (also for vscode intellsense)
    const body = contents.body as Sch2Ts<typeof postEchoSch>
    return {
        returnmsg: body.msg
    }
}