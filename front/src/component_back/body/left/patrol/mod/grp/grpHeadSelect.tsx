import {PATROL_SORT_ABC, PATROL_SORT_RECENT} from "../../../../../../data_back/const/common.ts";
import {useEffect, useState} from "react";
import {useLeftStore} from "../../../../../../store_back/zustand/left.ts";
import {useShallow} from "zustand/react/shallow";


const GrpHeadSelect = () => {

    const {activeGrpSort, setActiveGrpSort, patrolList, setPatrolList} = useLeftStore(useShallow((state)=> ({
        activeGrpSort : state.activeGrpSort,
        setActiveGrpSort : state.actions.setActiveGrpSort,
        patrolList : state.patrolList,
        setPatrolList : state.actions.setPatrolList
    })))

    const PATROL_SORT_LIST = [PATROL_SORT_RECENT, PATROL_SORT_ABC];
    const [isOpen, setIsOpen] = useState<boolean>(false);


    useEffect(() => {
        if(activeGrpSort.cd === PATROL_SORT_RECENT.cd){
            setPatrolList([...patrolList].sort((a, b) => Number(b.regDtm) - Number(a.regDtm)));
        }else if(activeGrpSort.cd === PATROL_SORT_ABC.cd){
            setPatrolList([...patrolList].sort((a, b) => a.name.localeCompare(b.name)));
        }
    }, [activeGrpSort]);

    const handleSort = (sort: {cd:string, nm:string}) => {
        setIsOpen(!isOpen);
        setActiveGrpSort(sort);
    }


    return(
        <div className={`select-box text ${isOpen ? "active" : ""}`}>
            <button className="btn--select" onClick={()=>setIsOpen(!isOpen)}>{activeGrpSort.nm}</button>
            <div className="drop-down">
                <ul>
                    {
                        PATROL_SORT_LIST.map((sort)=>(
                            <li className={`select__item ${sort.cd === activeGrpSort.cd ? "selected" : ""}`} onClick={()=>handleSort(sort)}>
                                <button>{sort.nm}</button>
                            </li>
                        ))
                    }
                </ul>
            </div>
        </div>
    )
}

export default GrpHeadSelect