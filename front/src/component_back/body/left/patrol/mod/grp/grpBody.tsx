import GrpBodyItem from "./grpBodyItem.tsx";
import {useLeftStore} from "../../../../../../store_back/zustand/left.ts";
import {useShallow} from "zustand/react/shallow";

const GrpBody = () => {

    const {patrolList} = useLeftStore(useShallow((state)=> ({
        patrolList : state.patrolList
    })))
    return(
        <div className="patrol__list">
            <ul className={"ct-scroll"}>
                {
                    patrolList.map((patrol)=>(
                        <GrpBodyItem patrol={patrol}/>
                    ))
                }
            </ul>
        </div>
    )

}

export default GrpBody