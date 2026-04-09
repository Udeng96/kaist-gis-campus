import {useLeftStore} from "../../../../store_back/zustand/left.ts";
import {useShallow} from "zustand/react/shallow";
import {LEFT_MOD_PATROL} from "../../../../data_back/const/common.ts";
import {useMainStore} from "../../../../store_back/zustand/main.ts";

const EndPatrolBtn = () => {

    const {activeMod} = useMainStore(useShallow((state)=> ({
        activeMod : state.activeMod,
    })))
    const {activePatrol, setActivePatrol} = useLeftStore(useShallow((state)=> ({
        activeTab : state.activeTab,
        activePatrol : state.activePatrol,
        setActivePatrol : state.actions.setActivePatrol
    })))

    return (

        <>
            {
                activeMod.cd === LEFT_MOD_PATROL.cd &&
                activePatrol !== null &&
                <button type="button" className="btn-exit" onClick={() => setActivePatrol(null)}>순찰모드 닫기</button>

            }
        </>
    )

}

export default EndPatrolBtn