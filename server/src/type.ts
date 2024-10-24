import type { Sch2Ts } from "ashes-urn"
import { serverObj } from "./app/ServerReport/SRSchema"

export interface GlobalConf {
    port: number
    key: string
}


export interface serverInStore extends Sch2Ts<typeof serverObj> { 
    timestamp: number;
}