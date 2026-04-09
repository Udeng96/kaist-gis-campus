import {useLeftStore} from "../../../../../../store_back/zustand/left.ts";
import {useShallow} from "zustand/react/shallow";
import {
    LEFT_CAMPUS_N,
    LEFT_MOD_PATROL,
    LEFT_MOD_PATROL_EDIT,
    LEFT_MOD_PATROL_REGI
} from "../../../../../../data_back/const/common.ts";
import {useMainStore} from "../../../../../../store_back/zustand/main.ts";

const RegiHead = () => {
    const {activeMod, setActiveMod} = useMainStore(useShallow((state)=>({
        activeMod : state.activeMod,
        setActiveMod : state.actions.setActiveMod
    })))
    const {
        setRegiPatrolNm,
        setRegiPatrolArea,
        setRegiPatrolCctvList,
        setEditPatrolNm,
        setEditPatrolArea,
        setEditPatrolCctvList,
    } = useLeftStore(useShallow((state) => ({
        setRegiPatrolNm: state.actions.setRegiPatrolNm,
        setRegiPatrolArea: state.actions.setRegiPatrolArea,
        setRegiPatrolCctvList: state.actions.setRegiPatrolCctvList,
        setEditPatrolNm: state.actions.setEditPatrolNm,
        setEditPatrolArea: state.actions.setEditPatrolArea,
        setEditPatrolCctvList: state.actions.setEditPatrolCctvList,
    })))

    const handleCancelBtn = () => {
        if(activeMod.cd === LEFT_MOD_PATROL_REGI.cd){
            setRegiPatrolNm("");
            setRegiPatrolArea(LEFT_CAMPUS_N);
            setRegiPatrolCctvList([]);

        }else if(activeMod.cd === LEFT_MOD_PATROL_EDIT.cd){
            setEditPatrolNm("");
            setEditPatrolArea(LEFT_CAMPUS_N);
            setEditPatrolCctvList([]);
        }
        setActiveMod(LEFT_MOD_PATROL);
    }

    return (
        <div className="content__frame__head">
            <h3>순찰 그룹 {activeMod.cd === LEFT_MOD_PATROL_REGI.cd ? "등록" : "편집"}</h3>
            <button type="button" className="btn-close btn-close-02 content-close" onClick={() => handleCancelBtn()}></button>
        </div>
    )

}

export default RegiHead