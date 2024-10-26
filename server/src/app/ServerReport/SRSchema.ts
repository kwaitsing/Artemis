import { t } from "ashes-urn";

const precObjSch = t.Object({
    used: t.Number(),
    total: t.Number()
})

export const serverObj = t.Object({
    name: t.String(),
    location: t.String({ maxLength: 2 }),
    uptime: t.Number(),
    loadAVG: t.Number(),
    cpu: t.Number(),
    mem: t.Object({
        onboard: precObjSch,
        swap: precObjSch
    }),
    storage: precObjSch,
    network: t.Object({
        total: t.Object({
            up: t.Number(),
            down: t.Number()
        }),
        current: t.Object({
            up: t.Number(),
            down: t.Number()
        })
    })
})

export const SRSchema = {
    msg: t.Object({
        key: t.String(),
        data: serverObj
    })
}