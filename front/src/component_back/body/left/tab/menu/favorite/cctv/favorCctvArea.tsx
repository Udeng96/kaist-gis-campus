import {
    CCTV_TYPE_FLAME,
    CCTV_TYPE_IN,
    CCTV_TYPE_OUT,
    CCTV_TYPE_WHOLE,
    TOAST_TYPE
} from "../../../../../../../data_back/const/common.ts";
import {useEffect, useState} from "react";
import type {CCTV_TYPE} from "../../../../../../../data_back/interface/leftInterface.tsx";
import {useLeftStore} from "../../../../../../../store_back/zustand/left.ts";
import {useShallow} from "zustand/react/shallow";
import {useFavoriteStore} from "../../../../../../../store_back/zustand/favorite.ts";
import {useGisStore} from "../../../../../../../store_back/zustand/gis.ts";
import {useMainStore} from "../../../../../../../store_back/zustand/main.ts";
import FavorCctvs from "./favorCctvs.tsx";

const FavorCctvArea = ({activeType}: { activeType: { id: string, cd: string, nm: string } }) => {

    const favorites = useFavoriteStore(state=> state.favorites);
    const setActiveToast = useMainStore(state=> state.actions.setActiveToast);

    const {favorCctvIconShow, setFavorCctvIconShow} = useGisStore(useShallow((state) => ({
        favorCctvIconShow: state.favorCctvIconShow,
        setFavorCctvIconShow: state.actions.setFavorCctvIconShow,
    })))

    const {cctvList, setActiveFavorCctvType} = useLeftStore(useShallow((state) => ({
        cctvList: state.cctvList,
        setActiveFavorCctvType: state.actions.setActiveFavorCctvType,
    })));

    const CCTV_TYPES = [CCTV_TYPE_WHOLE, CCTV_TYPE_IN, CCTV_TYPE_OUT, CCTV_TYPE_FLAME];

    const [activeCctvs, setActiveCctvs] = useState<CCTV_TYPE[]>([]);
    const [cctvCnt, setCctvCnt] = useState<number>(0);

    useEffect(() => {
        const newCctvs = cctvList.filter((cctv) => !cctv.streamId.includes("HIGH"));
        const filterCctvs = newCctvs.filter((item) => favorites.has(item.streamId));
        setActiveCctvs(filterCctvs);
        setCctvCnt(filterCctvs.length)

    }, [cctvList, favorites]);

    const handleIcon = () => {
        if (favorCctvIconShow) {
            setActiveToast({cd: TOAST_TYPE.SUCCESS, msg: '지도에서 건물명 표시가 해제되었습니다.'})
        } else {
            setActiveToast({cd: TOAST_TYPE.SUCCESS, msg: '지도에서 건물명 표시가 설정되었습니다.'})
        }
        setFavorCctvIconShow(!favorCctvIconShow);
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
                            <button type="button" className={`btn-map ${favorCctvIconShow ? '' : 'active'}`}
                                    onClick={() => handleIcon()}></button>
                        </div>
                    </div>
                    <div className="btn-wrap">
                        {
                            CCTV_TYPES.map((type, idx) => (
                                <button type="button"
                                        className={`btn-preset ${idx === 0 ? 'all' : ''} ${activeType.cd === type.cd ? 'active' : ''}`}
                                        onClick={() => setActiveFavorCctvType(type)}>{type.nm}</button>
                            ))
                        }
                    </div>
                    <FavorCctvs activeType={activeType} cctvs={activeCctvs}/>
                    <div className={`list__footer favorite`}>
                        <button type="button" className="btn btn-normal btn-ic plus">CCTV 등록</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default FavorCctvArea