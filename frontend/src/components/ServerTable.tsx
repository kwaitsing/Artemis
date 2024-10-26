import { secondsToTime, hread } from "toolbx"
import { serverInStore } from "../../../server/src/type"
import { useState, useEffect } from "react"

export const ServerTable = (props: {
    servers: serverInStore[]
}) => {

    const jumpToSrvCard = (name: string) => {
        const targetElement = document.getElementById(name);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop,
                behavior: 'smooth'
            });
        }
    }

    return (
        <table className="responsive center-align">
            <thead>
                <tr>
                    <th>Status</th>
                    <th>Region</th>
                    <th>Name</th>
                    <th>Uptime</th>
                    <th>Network(xB)</th>
                    <th>Network Current(xB)</th>
                    <th>CPU(%)</th>
                    <th>RAM(%)</th>
                    <th>Swap(%)</th>
                    <th>Storage(%)</th>
                </tr>
            </thead>
            <tbody>
                {
                    props.servers.map((server) => {
                        const [isDown, setIsDown] = useState(false);
                        const [currentTS, setCurrentTS] = useState(Math.floor(new Date().getTime() / 1000));

                        useEffect(() => {
                            setInterval(() => {
                                setCurrentTS(Math.floor(new Date().getTime() / 1000));
                                setIsDown((currentTS - server.timestamp) > 60);
                            }, 1000);
                        }, []);
                        const Huptime = secondsToTime(server.uptime)

                        const CPUusage = Math.round(server.cpu * 100) / 100

                        const memUsage = Math.round(server.mem.onboard.used / server.mem.onboard.total * 10000) / 100

                        const swapUsage = Math.round(server.mem.swap.used / server.mem.swap.total * 10000) / 100

                        const HnetworkRX = hread(server.network.total.down, true)
                        const HnetworkTX = hread(server.network.total.up, true)
                        const HCnetworkRX = hread(server.network.current.down, true)
                        const HCnetworkTX = hread(server.network.current.up, true)

                        const stoUsage = Math.round(server.storage.used / server.storage.total * 10000) / 100

                        return (
                            <tr key={server.name} onClick={() => jumpToSrvCard(server.name)}>
                                <td>
                                    <div className={`chip no-margin ${isDown ? 'red' : 'green'}`}><i>{isDown ? 'close' : 'verified'}</i></div>
                                </td>
                                <td><img className="large" src={`/client/${server.location}.svg`} /></td>
                                <td>{server.name}</td>
                                <td>
                                    {Huptime.num} {Huptime.unit}
                                </td>
                                <td>
                                    <span>{HnetworkTX.num}{HnetworkTX.unit}↑</span><br /><span>{HnetworkRX.num}{HnetworkRX.unit}↓</span><br />
                                </td>
                                <td>
                                    <span>{HCnetworkTX.num}{HCnetworkTX.unit}↑</span><br /><span>{HCnetworkRX.num}{HCnetworkRX.unit}↓</span><br />
                                </td>
                                <td>
                                    <div className="chip no-margin">
                                        <span>{CPUusage}</span>
                                        <progress className={`max ${server.cpu > 80 ? 'red' : ''}`} value={server.cpu} max="100"></progress>
                                    </div>
                                </td>
                                <td>
                                    <div className="chip no-margin">
                                        <span>{memUsage}</span>
                                        <progress className={`max ${memUsage > 80 ? 'red' : ''}`} value={memUsage} max="100"></progress>
                                    </div>
                                </td>
                                <td>
                                    <div className="chip no-margin">
                                        <span>{swapUsage}</span>
                                        <progress className={`max ${swapUsage > 80 ? 'red' : ''}`} value={swapUsage} max="100"></progress>
                                    </div>
                                </td>
                                <td>
                                    <div className="chip no-margin">
                                        <span>{stoUsage}</span>
                                        <progress className={`max ${stoUsage > 80 ? 'red' : ''}`} value={stoUsage} max="100"></progress>
                                    </div>
                                </td>
                            </tr>
                        )
                    })
                }
            </tbody>
        </table>
    )

}