import {useMainStore} from "../../../../../../store_back/zustand/main.ts";
import {
    CCTV_TYPE_WHOLE, LEFT_MENU_EVENT, MODAL_NONE,
    RIGHT_MOD_EVENT_CCTV,
    RIGHT_MOD_NONE,
    TOAST_TYPE
} from "../../../../../../data_back/const/common.ts";
import {useLeftStore} from "../../../../../../store_back/zustand/left.ts";
import CctvLiPage from "../../common/cctv/cctvLiPage.tsx";
import CctvLiCnt from "../../common/cctv/cctvLiCnt.tsx";
import CctvLi from "../../common/cctv/cctvLi.tsx";
import {useShallow} from "zustand/react/shallow";
import {useEffect, useState} from "react";
import type {CCTV_TYPE} from "../../../../../../data_back/interface/leftInterface.tsx";
import {useRightStore} from "../../../../../../store_back/zustand/right.ts";
import {useMutation} from "@tanstack/react-query";
import {clearEvent} from "../../../../../../data_back/api/left/leftApi.ts";
import moment from "moment";
import {useGisStore} from "../../../../../../store_back/zustand/gis.ts";

const EventCctv = () => {

    const {activeRightEventMod, activeModal, setActiveModal, setActiveToast} = useMainStore(useShallow((state) => ({
        activeRightEventMod: state.activeRightEventMod,
        activeModal: state.activeModal,
        setActiveModal: state.actions.setActiveModal,
        setActiveToast: state.actions.setActiveToast,
    })));
    const {activeEventCctvType, setActiveEventCctvType, setIsRefresh} = useRightStore(useShallow((state) => ({
        activeEventCctvType: state.activeEventCctvType,
        setActiveEventCctvType: state.actions.setActiveEventCctvType,
        setIsRefresh: state.actions.setIsRefresh,
    })));
    const {
        eventList,
        activeEvent,
        activeEventCctvs,
        setActiveEvent,
        setEventList,
        activeTab,
    } = useLeftStore(useShallow((state) => ({
        eventList: state.eventList,
        activeEvent: state.activeEvent,
        activeEventCctvs: state.activeEventCctvs,
        setActiveEvent: state.actions.setActiveEvent,
        setEventList: state.actions.setEventList,
        activeTab : state.activeTab
    })));

    const {isCastMode, setIsCastMode, setCastCctvList, castCctvList} = useGisStore(useShallow((state) => ({
        isCastMode: state.isCastMode,
        setIsCastMode: state.actions.setIsCastMode,
        setCastCctvList: state.actions.setCastCctvList,
        castCctvList: state.castCctvList,
    })))

    const [allCctvs, setAllCctvs] = useState<CCTV_TYPE[]>([]);
    const [cctvs, setCctvs] = useState<CCTV_TYPE[]>([]);

    useEffect(() => {
        setActiveEventCctvType(CCTV_TYPE_WHOLE);
        setCastCctvList([]);
    }, [activeEvent]);

    useEffect(() => {
        let newCctvs: CCTV_TYPE[] = [];
        if (activeEvent) {
            const type = activeEvent.type;


            if (activeEventCctvs.length > 0) {
                let filterActiveEventCctvs = [...activeEventCctvs];
                if(type === "flame"){
                    const flameCctv = filterActiveEventCctvs.filter((item)=> item.streamId === activeEvent.mappSensorId);
                    const filterFlame = filterActiveEventCctvs.filter((item)=> item.streamId !== activeEvent.mappSensorId);
                    filterActiveEventCctvs = [...flameCctv, ...filterFlame];
                }
                if (castCctvList.length > 0) {
                    newCctvs = [...filterActiveEventCctvs, ...castCctvList];
                } else {
                    newCctvs = [...filterActiveEventCctvs];
                }

            } else {
                if (castCctvList.length > 0) {
                    newCctvs = [...castCctvList];
                    setAllCctvs([...castCctvList]);
                }
            }
        }else{
            setIsCastMode(false);
            newCctvs = [];
        }
        setAllCctvs(newCctvs);

    }, [activeEventCctvType, activeEventCctvs, castCctvList, activeEvent]);

    useEffect(() => {
        let newCctvs = [...allCctvs];
        if (activeEventCctvType.cd !== CCTV_TYPE_WHOLE.cd) {
            newCctvs = newCctvs.filter((cctv) => cctv.plcType === activeEventCctvType.id);
        }
        setCctvs(newCctvs);
    }, [allCctvs, activeEventCctvType]);

    useEffect(() => {
        if (activeModal.cd === 'EVENT_CLR_CONFIRM_OK' && activeEvent) {
            clearEventMutation.mutate({seqn: activeEvent.seqn, clrDtm: moment().format("YYYYMMDDHHmmss")});
        }
    }, [activeModal]);


    const clrEvent = () => {
        if (activeEvent) {
            setActiveModal({cd: 'EVENT_CLR_CONFIRM', nm: '이벤트 종료'});
        }
    }

    const clearEventMutation = useMutation({
        mutationFn: clearEvent,
        onSuccess: (data) => {
            if (data) {
                if (data.data === "SUCCESS_RESPONSE" && activeEvent) {
                    const newEventItem = {...activeEvent, clrDtm: data.message};
                    const newEventList = eventList.map((event) => {
                        if (event.seqn === activeEvent.seqn) {
                            return newEventItem
                        } else {
                            return event;
                        }
                    })
                    setActiveModal(MODAL_NONE);
                    setActiveEvent(newEventItem);
                    setEventList(newEventList);
                    setActiveToast({cd: TOAST_TYPE.SUCCESS, msg: '이벤트 종료에 성공했습니다.'});
                } else {
                    setActiveToast({cd: TOAST_TYPE.ERROR, msg: '이벤트 종료에 실패했습니다.'});
                }
            }
        }
    })

    const handleCast = () => {
        if (isCastMode) {
            setIsCastMode(false);
            setCastCctvList([]);
        } else {
            setIsCastMode(true)
        }
    }

    useEffect(() => {
        if(activeRightEventMod.cd === RIGHT_MOD_NONE.cd || activeTab.cd !== LEFT_MENU_EVENT.cd){
            setIsCastMode(false);
            setCastCctvList([]);
        }
    }, [activeRightEventMod, activeTab]);

    return (
        <div
            className={`content__frame content__frame--details event ${activeRightEventMod.cd === RIGHT_MOD_EVENT_CCTV.cd ? 'active' : ''}`}>
            <div className="content__head">
                <h2 className="content__title content__title--cctv">{activeEvent?.mappBuildingId} 주변 CCTV</h2>
                <div className="frame">
                    <button type="button" className="btn-refresh" onClick={() => setIsRefresh(true)}>새로고침<i></i>
                    </button>
                    <button type="button" className="btn btn-negative"
                            disabled={activeEvent === null || (activeEvent && (activeEvent.clrDtm !== null && activeEvent.clrDtm !== ''))}
                            onClick={clrEvent}>이벤트 종료<i></i></button>
                </div>
            </div>
            <div className="content__body">
                <div className="content__sub-head">
                    <h2 className="content__sub-title">실시간 CCTV<span>{activeEventCctvs.length}</span>대</h2>
                    <button type="button" className={`btn btn-normal btn-ic plus ${isCastMode ? 'active' : ''}`}
                            onClick={() => handleCast()}>수동 투망<i></i></button>
                </div>
                <CctvLiCnt cctvs={allCctvs}/>
                <CctvLi cctvs={cctvs}/>
                <CctvLiPage cctvs={cctvs}/>
            </div>
        </div>
    )

}

export default EventCctv