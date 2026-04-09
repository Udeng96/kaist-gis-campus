import {useFavoriteStore} from "../../../../../../../store_back/zustand/favorite.ts";
import {useShallow} from "zustand/react/shallow";
import {useMainStore} from "../../../../../../../store_back/zustand/main.ts";
import * as React from "react";
import {useEffect, useState} from "react";
import type {CCTV_TYPE} from "../../../../../../../data_back/interface/leftInterface.tsx";
import {useLeftStore} from "../../../../../../../store_back/zustand/left.ts";
import {TOAST_TYPE} from "../../../../../../../data_back/const/common.ts";
import {useGisStore} from "../../../../../../../store_back/zustand/gis.ts";

const FavorCctvItem = ({cctv, idx}: {
    cctv: CCTV_TYPE,
    idx: number,
}) => {

    const {
        selectFavorCctvList,
        setSelectFavorCctvList,
        activeFavorBuildingCctvs,
        activeFavorBuilding,
    } = useLeftStore(useShallow((state) => ({
        activeTab: state.activeTab,
        selectFavorCctvList: state.selectFavorCctvList,
        setSelectFavorCctvList: state.actions.setSelectFavorCctvList,
        setActiveFavorBuildingCctvs: state.actions.setActiveFavorBuildingCctvs,
        activeFavorBuildingCctvs: state.activeFavorBuildingCctvs,
        activeFavorBuilding : state.activeFavorBuilding,
    })))

    const setRemoveStreamId = useGisStore(state => state.actions.setRemoveStreamId);

    const {favorites, toggleFavorite} = useFavoriteStore(useShallow((state) => ({
        favorites: state.favorites,
        toggleFavorite: state.actions.toggleFavorite
    })));

    const setActiveToast = useMainStore(state=> state.actions.setActiveToast)


    const [classNm, setClassNm] = useState<string>("");

    useEffect(() => {
        if(activeFavorBuilding !== null){
            const activeBuildingCctvIds = activeFavorBuildingCctvs.map((cctv) => cctv.streamId);
            if (activeBuildingCctvIds.includes(cctv.streamId)) {
                setClassNm("highlight");
            } else {
                setClassNm("");
            }
        }else{
            const selectIds = selectFavorCctvList.map((cctv) => cctv.streamId);
            if (selectIds.includes(cctv.streamId)) {
                setClassNm("active");
            } else {
                setClassNm("");
            }
        }
    }, [activeFavorBuildingCctvs,selectFavorCctvList,activeFavorBuilding, cctv]);

    const handleItem = () => {
        if(activeFavorBuilding !== null){
            setActiveToast({cd : TOAST_TYPE.WARNING, msg:"선택된 건물을 해제한 후, 다시 시도해주세요."});
        }else{
            if (selectFavorCctvList.includes(cctv)) {
                const newSelectCctvList = selectFavorCctvList.filter((favorCctv) => favorCctv.streamId !== cctv.streamId);
                setSelectFavorCctvList(newSelectCctvList);
                setRemoveStreamId(cctv.streamId);
            } else {
                setSelectFavorCctvList([...selectFavorCctvList, cctv]);
            }
        }

    }

    const handleFavoriteBtn = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, cctv: CCTV_TYPE) => {
        e.stopPropagation();
        if (favorites.has(cctv.streamId)) {
            setActiveToast({cd: TOAST_TYPE.SUCCESS, msg: '즐겨찾기가 해제되었습니다.'})
        } else {
            setActiveToast({cd: TOAST_TYPE.SUCCESS, msg: '즐겨찾기가 등록되었습니다.'})
        }
        toggleFavorite(cctv.streamId);
    }

    const setPlcType = (plcType: string) => {
        if (plcType === '1') {
            return 'in'
        } else if (plcType === '2') {
            return 'out'
        } else if (plcType === '3') {
            return 'flame'
        }
    }

    const setPlcTypeNm = (plcType: string) => {
        if (plcType === '1') {
            return '내부'
        } else if (plcType === '2') {
            return '외부'
        } else if (plcType === '3') {
            return '불꽃'
        }
    }

    const setIdx = () => {
        return selectFavorCctvList.findIndex((favorCctv) => favorCctv.streamId === cctv.streamId);
    }
    
    return(
        <li className={`list__item ${setPlcType(cctv.plcType)} ${classNm}`}
            onClick={() => handleItem()}>
            <div><i className="ic-mark">{classNm === 'highlight' ? idx + 1 : classNm === 'active' ? setIdx()+1 :  ''}</i>{setPlcTypeNm(cctv.plcType)}</div>
            <div>{cctv.cctvNm}</div>
            <div className="frame">
                <button type="button"
                        className={`btc-edit`}
                        disabled={true}
                >
                </button>
                <button type="button"
                        onClick={(e) => handleFavoriteBtn(e, cctv)}
                        className={`btn-favorites ${favorites.has(cctv.streamId) ? "active" : ""} `}></button>
            </div>
        </li>
    )

}
export default FavorCctvItem