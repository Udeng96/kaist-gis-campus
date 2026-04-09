import {useMainStore} from "../../../../store_back/zustand/main.ts";
import {useShallow} from "zustand/react/shallow";
import {
    LEFT_MOD_PATROL,
    LEFT_MOD_PATROL_EDIT,
    LEFT_MOD_PATROL_REGI,
    LEFT_MOD_TAB
} from "../../../../data_back/const/common.ts";
import {useLeftStore} from "../../../../store_back/zustand/left.ts";

const Patrol = () =>{

    const {activeMod, setActiveMod} = useMainStore(useShallow((state)=>({
        activeMod : state.activeMod,
        setActiveMod : state.actions.setActiveMod
    })))

    const setAcitvePatrol = useLeftStore().actions.setActivePatrol;

    const handlePatrol = () => {
        if(activeMod.cd === LEFT_MOD_PATROL.cd){
            setActiveMod(LEFT_MOD_TAB);
        }else{
            setActiveMod(LEFT_MOD_PATROL)
        }
        setAcitvePatrol(null);
    }

    return(
        <button type="button" className={`btn-patrol ${activeMod.cd === LEFT_MOD_PATROL.cd || activeMod.cd === LEFT_MOD_PATROL_REGI.cd || activeMod.cd === LEFT_MOD_PATROL_EDIT.cd ? 'active' :''}`} onClick={handlePatrol}>순찰모드</button>
    )
}

export default Patrol