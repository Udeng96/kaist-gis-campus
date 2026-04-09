import CctvLiCnt from "./cctvLiCnt.tsx";
import {useRightStore} from "../../../../../../store_back/zustand/right.ts";
import {useShallow} from "zustand/react/shallow";
import {
    CCTV_TYPE_FLAME,
    CCTV_TYPE_IN,
    CCTV_TYPE_OUT,
    CCTV_TYPE_WHOLE, LEFT_MENU_FAVORITE,
    RIGHT_MENU_CCTV
} from "../../../../../../data_back/const/common.ts";
import CctvLiPage from "./cctvLiPage.tsx";
import CctvLi from "./cctvLi.tsx";
import {useEffect, useState} from "react";
import type {CCTV_TYPE} from "../../../../../../data_back/interface/leftInterface.tsx";
import {useLeftStore} from "../../../../../../store_back/zustand/left.ts";

const Cctv = ({activeMenu, activeType, buildingCctvs}: {activeMenu: string, activeType: string, buildingCctvs: CCTV_TYPE[]}) => {

    const acitveTab = useLeftStore(state=> state.activeTab);
    const {setActiveCctvType, setActiveCctvFavorType} = useRightStore(useShallow((state) => ({
        setActiveCctvType : state.actions.setActiveCctvType,
        setActiveCctvFavorType : state.actions.setActiveCctvFavorType,
    })))
    const [cctvs, setCctvs] = useState<CCTV_TYPE[]>([]);


    useEffect(() => {
        if(buildingCctvs.length > 0){
            if(activeType === CCTV_TYPE_WHOLE.cd){
                setCctvs([...buildingCctvs]);
            }else{
                setCctvs(buildingCctvs.filter((cctv)=> setFilterType(cctv.plcType)));
            }
        }else{
            if(acitveTab.cd === LEFT_MENU_FAVORITE.cd){
                setActiveCctvFavorType(CCTV_TYPE_WHOLE);
            }else{
                setActiveCctvType(CCTV_TYPE_WHOLE);
            }
            setCctvs([]);
        }
    }, [activeType, buildingCctvs]);

    const setFilterType = (plcType : string) => {
        if(activeType === CCTV_TYPE_IN.cd){
            return plcType === '1';
        }else if(activeType === CCTV_TYPE_OUT.cd){
            return plcType === '2';
        }else if(activeType === CCTV_TYPE_FLAME.cd){
            return plcType === '3';
        }else{
            return true;
        }
    }

    return (
        <li className={`tab__item tab__item--cctv ${activeMenu === RIGHT_MENU_CCTV.cd ? 'active' : ''}`}>
            <div className="content__sub-head">
                <h2 className="content__sub-title">실시간 CCTV<span>{buildingCctvs.length}</span>대</h2>
            </div>
            <CctvLiCnt cctvs={buildingCctvs}/>
            <CctvLi cctvs={[...cctvs]}/>
            <CctvLiPage cctvs={[...cctvs]}/>
        </li>
    )

}

export default Cctv