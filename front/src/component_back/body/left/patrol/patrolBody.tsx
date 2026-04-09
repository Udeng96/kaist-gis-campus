import GrpHead from "./mod/grp/grpHead.tsx";
import GrpBody from "./mod/grp/grpBody.tsx";
import {useEffect} from "react";
import {LEFT_CAMPUS_N, LEFT_MOD_PATROL} from "../../../../data_back/const/common.ts";
import {useMainStore} from "../../../../store_back/zustand/main.ts";
import {useLeftStore} from "../../../../store_back/zustand/left.ts";
import {useShallow} from "zustand/react/shallow";

const PatrolBody = () => {
    const activeMod = useMainStore((state) => state.activeMod);

    const {
        setRegiPatrolNm,
        setRegiPatrolArea,
        setRegiPatrolCctvList,

    } = useLeftStore(useShallow((state) => ({
        setRegiPatrolNm: state.actions.setRegiPatrolNm,
        setRegiPatrolArea: state.actions.setRegiPatrolArea,
        setRegiPatrolCctvList: state.actions.setRegiPatrolCctvList,

    })))

    useEffect(() => {
        if(activeMod.cd === LEFT_MOD_PATROL.cd){
            setRegiPatrolNm('');
            setRegiPatrolArea(LEFT_CAMPUS_N);
            setRegiPatrolCctvList([]);
        }
    }, [activeMod]);

    return (
        <div className="patrol__body">
            <GrpHead/>
            <GrpBody/>
        </div>
    )

}

export default PatrolBody