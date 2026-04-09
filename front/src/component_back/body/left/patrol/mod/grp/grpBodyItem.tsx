import GrpBodyItemCctv from "./grpBodyItemCctv.tsx";
import {
    CCTV_TYPE_FLAME,
    CCTV_TYPE_IN,
    CCTV_TYPE_OUT, LEFT_CAMPUS_N,
    LEFT_MOD_PATROL_EDIT
} from "../../../../../../data_back/const/common.ts";
import {useLeftStore} from "../../../../../../store_back/zustand/left.ts";
import {useShallow} from "zustand/react/shallow";
import * as React from "react";
import {useMainStore} from "../../../../../../store_back/zustand/main.ts";
import type {CCTV_TYPE, PATROL_TYPE} from "../../../../../../data_back/interface/leftInterface.tsx";
import {useEffect, useState} from "react";

const GrpBodyItem = (props:{patrol:PATROL_TYPE}) => {

    const setActiveMod = useMainStore().actions.setActiveMod;
    const {cctvList,openPatrolList, setOpenPatrolList, setActivePatrol, activePatrol, setEditPatrol, setEditPatrolCctvList, setEditPatrolArea, setEditPatrolNm} = useLeftStore(useShallow((state)=> ({
        cctvList : state.cctvList,
        openPatrolList : state.openPatrolList,
        setOpenPatrolList : state.actions.setOpenPatrolList,
        setActivePatrol : state.actions.setActivePatrol,
        activePatrol : state.activePatrol,
        setEditPatrol : state.actions.setEditPatrol,
        setEditPatrolNm : state.actions.setEditPatrolNm,
        setEditPatrolArea : state.actions.setEditPatrolArea,
        setEditPatrolCctvList : state.actions.setEditPatrolCctvList
    })))

    const [patrolCctvList, setPatrolCctvList] = useState<CCTV_TYPE[]>([]);



    const handleGrp = () => {
        if(openPatrolList.includes(props.patrol.id)){
            const newPatrol = openPatrolList.filter((grp) => grp !== props.patrol.id);
            setOpenPatrolList(newPatrol);
        }else{
            setOpenPatrolList([...openPatrolList, props.patrol.id]);
        }
    }

    const handlePlayBtn = (e:  React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation();

        if(activePatrol === null){
            setActivePatrol(props.patrol);
        }else{
            if(activePatrol.id === props.patrol.id){
                setActivePatrol(null);
            }else{
                setActivePatrol(props.patrol);
            }
        }
    }

    const handleEditBtn = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation();
        setEditPatrol(props.patrol);
        setActiveMod(LEFT_MOD_PATROL_EDIT);
        setEditPatrolNm(props.patrol.name);
        setEditPatrolArea(LEFT_CAMPUS_N);
        setEditPatrolCctvList(patrolCctvList);
    }

    useEffect(() => {
        if(cctvList.length > 0){
            const newCctvList : CCTV_TYPE[] = [];
            const filterIdList : string[] = props.patrol.cctvMappId.split(", ");
            filterIdList.map((streamId)=> {
                const cctv = cctvList.find((cctv) => cctv.streamId === streamId.split("/")[1]);
                const area = streamId.split("/")[0];
                if(cctv){
                    cctv.building = area;
                    newCctvList.push(cctv);
                }
            })
            setPatrolCctvList(newCctvList);
        }
    }, [cctvList,props.patrol]);

    const setCctvType = (plcType : string) => {
        if(plcType === CCTV_TYPE_IN.id){
            return CCTV_TYPE_IN
        }else if(plcType === CCTV_TYPE_OUT.id){
            return CCTV_TYPE_OUT
        }else{
            return CCTV_TYPE_FLAME
        }
    }

    return(
        <li className="patrol__item " onClick={handleGrp}>
            <div className={`patrol__item__head ${openPatrolList.includes(props.patrol.id) ? 'active' : ''}`}>
                <p>{props.patrol.name}</p>
                <button type="button" className={`btn-play ${activePatrol && activePatrol.id === props.patrol.id ? 'active' : ''}`} onClick={(e)=>handlePlayBtn(e)}></button>
            </div>
            <div className="patrol__item__body">
                {
                    patrolCctvList.map((patrolCctv,idx)=>(
                        <GrpBodyItemCctv index={idx+1} cctv={{building_cd:patrolCctv.building, type: setCctvType(patrolCctv.plcType), nm:patrolCctv.cctvNm}}/>
                    ))
                }
                <button type="button" className="btn btn-normal btn-ic pen" onClick={(e)=>handleEditBtn(e)}>편집</button>
            </div>
        </li>
    )
}

export default GrpBodyItem