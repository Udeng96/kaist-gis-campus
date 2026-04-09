import GrpHeadSelect from "./grpHeadSelect.tsx";
import {useLeftStore} from "../../../../../../store_back/zustand/left.ts";

const GrpHead = () => {
    const patrolList = useLeftStore((state)=> state.patrolList);

    return(
        <div className="content__sub-head">
            <h2 className="content__sub-title">총<span>{patrolList.length}</span>대</h2>
            <GrpHeadSelect/>
        </div>
    )
}
export default GrpHead