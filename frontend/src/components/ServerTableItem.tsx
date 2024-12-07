import { secondsToTime, hread } from "toolbx"
import { serverInStore } from "../../../server/src/type"

export const ServerTableItem = (props: {
    currentTS: number,
    server: serverInStore
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

    const Huptime = secondsToTime(props.currentTS - props.server.uptime)

    const CPUusage = Math.round(props.server.cpu * 100) / 100

    const memUsage = Math.round(props.server.mem.onboard.used / props.server.mem.onboard.total * 10000) / 100

    const swapUsage = Math.round(props.server.mem.swap.used / props.server.mem.swap.total * 10000) / 100

    const HnetworkRX = hread(props.server.network.total.down, true)
    const HnetworkTX = hread(props.server.network.total.up, true)
    const HCnetworkRX = hread(props.server.network.current.down * 8, true, 0, false)
    const HCnetworkTX = hread(props.server.network.current.up * 8, true, 0, false)

    const stoUsage = Math.round(props.server.storage.used / props.server.storage.total * 10000) / 100

    return (
        <tr key={props.server.name} onClick={() => jumpToSrvCard(props.server.name)}>
            <td>
                <div className={`chip no-margin ${props.currentTS - props.server.timestamp > 60 ? 'red' : 'green'}`}><i>{props.currentTS - props.server.timestamp > 60 ? 'close' : 'verified'}</i></div>
            </td>
            <td><img className="large" src={`/client/${props.server.location}.svg`} /></td>
            <td>{props.server.name}</td>
            <td>
                {Huptime.num} {Huptime.unit}
            </td>
            <td>
                <span>{HnetworkTX.num}{HnetworkTX.unit}↑</span><br /><span>{HnetworkRX.num}{HnetworkRX.unit}↓</span><br />
            </td>
            <td>
                <span>{HCnetworkTX.num}{HCnetworkTX.unit}ps↑</span><br /><span>{HCnetworkRX.num}{HCnetworkRX.unit}ps↓</span><br />
            </td>
            <td>
                <div className="chip no-margin">
                    <span>{CPUusage}</span>
                    <progress className={`max ${props.server.cpu > 80 ? 'red' : ''}`} value={props.server.cpu} max="100"></progress>
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
}