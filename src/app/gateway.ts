import type { MaybePromise, Result, RuntimeRoute } from "ashes-urn";
import type { OPT } from "..";

export async function gateway(contents: OPT, routeObj: RuntimeRoute, app: ((...args: any[]) => MaybePromise<Result | any>)) {
    contents.logestic.warn('Oh something hit the gateway')
    return await app(contents)
}