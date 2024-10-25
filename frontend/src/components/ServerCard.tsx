import { serverInStore } from "../../../server/src/type"
import { LazySvg } from "./LazySvg"

export const ServerCard = (props: {
    data: serverInStore
}) => {
    return (
        <article>
            <div className="row">
                <div>
                    <LazySvg name={props.data.location} />
                </div>
                <div className="max">
                    <h5>Title</h5>
                    <p>Some text here</p>
                </div>
            </div>
            <nav>
                <button>Button</button>
            </nav>
        </article>
    )

}