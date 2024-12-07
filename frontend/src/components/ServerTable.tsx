import { serverInStore } from "../../../server/src/type"
import { ServerTableItem } from "./ServerTableItem"

export const ServerTable = (props: {
    currentTS: number
    servers: serverInStore[]
    downServers: serverInStore[]
    displayDown: boolean
}) => {

    return (
        <>
            <table className="responsive center-align">
                <thead>
                    <tr>
                        <th>Status</th>
                        <th>Region</th>
                        <th>Name</th>
                        <th>Uptime</th>
                        <th>Network(xB)</th>
                        <th>Network Current(xbps)</th>
                        <th>CPU(%)</th>
                        <th>RAM(%)</th>
                        <th>Swap(%)</th>
                        <th>Storage(%)</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        props.displayDown ?
                            props.downServers.map((server) => {
                                return <ServerTableItem key={"STdown"} currentTS={props.currentTS} server={server} />
                            })
                            : ''
                    }
                    {props.displayDown ? ( 
                        <tr>
                            <td colSpan={10}><hr /></td>
                        </tr>
                    ) : ''}
                    {
                        props.servers.map((server) => {
                            return <ServerTableItem key={"STup"} currentTS={props.currentTS} server={server} />
                        })
                    }
                </tbody>
            </table>
        </>
    )

}