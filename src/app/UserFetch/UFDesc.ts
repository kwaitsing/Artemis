import type { Module } from "ashes-urn";
import UFHandler from "./UFHandler";

export const UserFetch: Module = {
    name: "UserFetch",
    prefix: '/api/v1',
    routes: [
        {
            method: 'GET',
            path: "/servers",
            isDirect: true,
            handler: UFHandler.getServers
        }
    ]
}