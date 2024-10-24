import type { Module } from "ashes-urn";
import { postEcho, rootHandler } from "./RootInterface";
import { postEchoSch } from "./RootSchema";

export const ServerRoot: Module = {
    name: "Root",
    routes: [
        {
            method: "GET",
            path: "/",
            isDirect: false,
            handler: rootHandler
        },
        {
            method: "POST",
            path: "/post-echo",
            isDirect: true,
            handler: postEcho,
            addon: {
                body: postEchoSch
            }
        }
    ]
}