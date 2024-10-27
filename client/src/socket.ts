import { GlobalConfiguration } from "..";
import { collector } from "./collector";

// Transmitter
export const transmitter = () => {

    let isWSBlocked = false

    // Create WebSocket channel
    const wsSocket = new WebSocket(GlobalConfiguration.remote + '/api/v1/upload', {
        //@ts-ignore
        headers: {
            "Content-Type": "application/json"
        }
    })

    const transITVL = setInterval(async () => {
        if (!isWSBlocked) {
            const data = JSON.stringify({
                key: GlobalConfiguration.key,
                data: collector()
            });
            if (GlobalConfiguration.verbose) console.log(data)
            wsSocket.send(data);
        }
    }, GlobalConfiguration.updInterval * 1000)

    // Avoid ws send blockage
    const wsCheckITVL = setInterval(function () {
        if (wsSocket.bufferedAmount == 0) {
            isWSBlocked = false
        } else {
            isWSBlocked = true
        }
    }, 50);

    // Fail Reconnector
    wsSocket.addEventListener("close", () => {
        clearInterval(wsCheckITVL)
        clearInterval(transITVL);
        wsSocket.close();
        setTimeout(() => {
            transmitter()
        }, 5000);
    });

}