import {
    CCTV_TYPE_FLAME,
    CCTV_TYPE_IN,
    CCTV_TYPE_OUT,
    CCTV_TYPE_WHOLE,
    RIGHT_MOD_CCTV_EDIT,
    RIGHT_MOD_CCTV_REGI,
    TOAST_TYPE
} from "../../../../../../../data_back/const/common.ts";
import {useLeftStore} from "../../../../../../../store_back/zustand/left.ts";
import {useShallow} from "zustand/react/shallow";
import Cctvs from "./cctvs.tsx";
import {useEffect, useState} from "react";
import type {CCTV_TYPE} from "../../../../../../../data_back/interface/leftInterface.tsx";
import {useMainStore} from "../../../../../../../store_back/zustand/main.ts";
import {useGisStore} from "../../../../../../../store_back/zustand/gis.ts";

const CctvArea = (props: { activeType: { id: string, cd: string, nm: string } }) => {
    const {
        cctvList,
        setActiveCctvType,
        setActiveBuilding,
        setActiveBuildingCctvs,
        activeBuilding,
        setSelectCctvList,
    } = useLeftStore(useShallow((state) => ({
        cctvList: state.cctvList,
        setActiveCctvType: state.actions.setActiveCctvType,
        setActiveBuilding: state.actions.setActiveBuilding,
        setActiveBuildingCctvs: state.actions.setActiveBuildingCctvs,
        activeBuilding: state.activeBuilding,
        setSelectCctvList: state.actions.setSelectCctvList
    })));

    const {setActiveRightMod, setActiveToast, activeRightMod} = useMainStore(useShallow((state) => ({
        setActiveRightMod: state.actions.setActiveRightMod,
        setActiveToast: state.actions.setActiveToast,
        activeRightMod: state.activeRightMod,
    })))

    const {cctvIconShow, setCctvIconShow} = useGisStore(useShallow((state) => ({
        cctvIconShow: state.cctvIconShow,
        setCctvIconShow: state.actions.setCctvIconShow,
    })))

    const [activeCctvs, setActiveCctvs] = useState<CCTV_TYPE[]>([]);
    const [cctvCnt, setCctvCnt] = useState<number>(0);

    const CCTV_TYPES = [CCTV_TYPE_WHOLE, CCTV_TYPE_IN, CCTV_TYPE_OUT, CCTV_TYPE_FLAME];

    useEffect(() => {
        const newCctvs = cctvList.filter((cctv) => !cctv.streamId.includes("HIGH"));
        setActiveCctvs(newCctvs);
        setCctvCnt(newCctvs.length)
    }, [cctvList]);

    const handleIcon = () => {
        if (cctvIconShow) {
            setActiveToast({cd: TOAST_TYPE.SUCCESS, msg: '지도에서 건물명 표시가 해제되었습니다.'})
        } else {
            setActiveToast({cd: TOAST_TYPE.SUCCESS, msg: '지도에서 건물명 표시가 설정되었습니다.'})
        }
        setCctvIconShow(!cctvIconShow);
    }

    const handleRegiBtn = () => {
        setSelectCctvList([]);
        if (activeBuilding) {
            setActiveBuilding(null);
            setActiveBuildingCctvs([]);
            setTimeout(() => {
                setActiveRightMod(RIGHT_MOD_CCTV_REGI);
            }, 1000)
        } else {
            setActiveRightMod(RIGHT_MOD_CCTV_REGI);
        }
    }

    return (
        <>
            <div className="list__container">
                <p className="info">CCTV 다중 선택시, 선택 순서대로 번호 마커가 표시됩니다.</p>
                <div className="list list--cctv">
                    <div className="list__head">
                        <h3 className="list__title">CCTV 리스트<span>{cctvCnt}</span></h3>
                        <div className="list__map">
                            지도 표출
                            <button type="button" className={`btn-map ${cctvIconShow ? '' : 'active'}`}
                                    onClick={() => handleIcon()}></button>
                        </div>
                    </div>
                    <div className="btn-wrap">
                        {
                            CCTV_TYPES.map((type, idx) => (
                                <button type="button"
                                        className={`btn-preset ${idx === 0 ? 'all' : ''} ${props.activeType.cd === type.cd ? 'active' : ''}`}
                                        onClick={() => setActiveCctvType(type)}>{type.nm}</button>
                            ))
                        }
                    </div>
                    <Cctvs activeType={props.activeType} cctvs={activeCctvs}/>
                    <div className={`list__footer`}>
                        <button type="button" className="btn btn-normal btn-ic plus"
                                disabled={activeRightMod.cd === RIGHT_MOD_CCTV_EDIT.cd}
                                onClick={() => handleRegiBtn()}>CCTV 등록
                        </button>
                    </div>
                </div>
            </div>

        </>
    )
}

export default CctvArea