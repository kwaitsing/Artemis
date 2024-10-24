import { t } from "ashes-urn";

const precObjSch = t.Object({
    free: t.Number(),
    occu: t.Number()
})

export const serverObj = t.Object({
    name: t.String(),
    location: t.String({maxLength: 2}),
    uptime: t.Number(),
    loadAVG: t.Number(),
    cpu: t.Number(),
    mem: t.Object({
        onboard: precObjSch,
        swap: precObjSch
    }),
    storage: precObjSch,
    traffic: t.Object({
        up: t.Number(),
        down: t.Number()
    })
})

export const SRSchema = {
    msg: t.Object({
        key: t.String(),
        data: serverObj
    })
}