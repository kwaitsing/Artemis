import type { Sch2Ts } from "ashes-urn"
import type { SRSchema } from "../../server/src/app/ServerReport/SRSchema"

export interface GlobalConf {
    remote: string
    key: string
    name: string
    updInterval: number
}

export interface oneTimeDataType {
    countryCode: string
}

export type uploadDataType = Sch2Ts<typeof SRSchema.msg>['data']