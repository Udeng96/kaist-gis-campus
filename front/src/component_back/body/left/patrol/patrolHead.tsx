import {useMainStore} from "../../../../store_back/zustand/main.ts";
import {LEFT_MOD_PATROL_REGI} from "../../../../data_back/const/common.ts";

const PatrolHead = () => {

    const setActiveMod = useMainStore().actions.setActiveMod;

    return (
        <div className="patrol__head">
            <h2 className="content__title">순찰 모드</h2>
            <button type="button" className="btn btn-normal btn-ic plus patrol-group" onClick={()=>setActiveMod(LEFT_MOD_PATROL_REGI)}>순찰 그룹 등록</button>
        </div>
    )

}

export default PatrolHead