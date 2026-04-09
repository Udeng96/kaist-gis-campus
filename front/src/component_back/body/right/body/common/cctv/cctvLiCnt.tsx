import {
    CCTV_TYPE_FLAME,
    CCTV_TYPE_IN,
    CCTV_TYPE_OUT,
    CCTV_TYPE_WHOLE,
    LEFT_MENU_CAMPUS, LEFT_MENU_EVENT
} from "../../../../../../data_back/const/common.ts";
import {useRightStore} from "../../../../../../store_back/zustand/right.ts";
import {useShallow} from "zustand/react/shallow";
import type {CCTV_TYPE} from "../../../../../../data_back/interface/leftInterface.tsx";
import {useLeftStore} from "../../../../../../store_back/zustand/left.ts";
import {useEffect, useState} from "react";

const CctvLiCnt = (props:{cctvs:CCTV_TYPE[]}) => {

    const CCTV_TYPES = [CCTV_TYPE_WHOLE, CCTV_TYPE_IN, CCTV_TYPE_OUT, CCTV_TYPE_FLAME];
    const activeTab = useLeftStore((state)=> state.activeTab);
    const {activeCctvType, activeEventCctvType, setActiveCctvType, setActiveEventCctvType} = useRightStore(useShallow((state)=> ({
        activeCctvType : state.activeCctvType,
        activeEventCctvType : state.activeEventCctvType,
        setActiveCctvType : state.actions.setActiveCctvType,
        setActiveEventCctvType : state.actions.setActiveEventCctvType,
    })))

    const [activeType, setActiveType] = useState<{id:string, cd:string, nm:string}>(CCTV_TYPE_WHOLE);

    const handleCctvType = (type:{id:string, cd:string, nm:string}) => {
        if(activeTab.cd === LEFT_MENU_CAMPUS.cd){
            setActiveCctvType(type);
        }else if(activeTab.cd === LEFT_MENU_EVENT.cd){
            setActiveEventCctvType(type);
        }
    }

    useEffect(() => {
        if(activeTab.cd === LEFT_MENU_CAMPUS.cd){
            setActiveType(activeCctvType)
        }else if(activeTab.cd === LEFT_MENU_EVENT.cd){
            setActiveType(activeEventCctvType);
        }
    }, [activeTab, activeCctvType, activeEventCctvType]);


    return(
        <div className="preset-wrap">
            {
                CCTV_TYPES.map((cctvType,idx)=>(
                    <button key={cctvType.cd} type="button" className={`btn-preset ${idx===0 ? 'all' : ''} ${activeType.cd === cctvType.cd ? 'active' : ''}`} onClick={()=>handleCctvType(cctvType)}>
                        <p className={`name ${cctvType.cd}`}>{cctvType.nm}</p>
                        <p className="value">{idx === 0 ? props.cctvs.length : props.cctvs.filter((cctv)=> cctv.plcType === idx.toString()).length}</p>
                    </button>
                ))
            }
        </div>
    )
}

export default CctvLiCnt