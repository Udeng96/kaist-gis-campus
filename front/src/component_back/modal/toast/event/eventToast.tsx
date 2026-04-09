import {useMainStore} from "../../../../store_back/zustand/main.ts";
import {useShallow} from "zustand/react/shallow";
import {useEffect, useState} from "react";
import {EVENT_TYPE_FIRE, EVENT_TYPE_FLAME, LEFT_MENU_EVENT} from "../../../../data_back/const/common.ts";
import moment from "moment";
import {useLeftStore} from "../../../../store_back/zustand/left.ts";
import type {EVENT_TYPE} from "../../../../data_back/interface/leftInterface.tsx";

const EventToast = () => {

    // 이벤트 알림 쌓임.
    const {activeWsEvent, webSocketEvents, setWebSocketEvents, setActiveWsEvent} = useMainStore(useShallow((state) => ({
        activeWsEvent: state.activeWsEvent,
        webSocketEvents: state.webSocketEvents,
        setWebSocketEvents: state.actions.setWebSocketEvents,
        setActiveWsEvent: state.actions.setActiveWsEvent,
    })))

    const {
        activeTab,
        alarmOn,
        eventList,
        setEventList,
        setActiveEvent,
        setActiveTab
    } = useLeftStore(useShallow((state) => ({

        activeTab: state.activeTab,
        alarmOn: state.alarmOn,
        eventList: state.eventList,
        setEventList: state.actions.setEventList,
        setActiveEvent: state.actions.setActiveEvent,
        setActiveTab: state.actions.setActiveTab
    })));


    const [isOver, setIsOver] = useState<boolean>(true);
    const [toastEventList, setToastEventList] = useState<EVENT_TYPE[]>([]);
    const [secondList, setSecondList] = useState<number[]>([]);

    useEffect(() => {
        if (activeWsEvent) {
            setWebSocketEvents([...webSocketEvents, activeWsEvent]);
        }
    }, [activeWsEvent]);

    useEffect(() => {
        if (webSocketEvents.length > 0) {
            setIsOver(false);
        } else {
            setIsOver(true);
            if (secondList.length > 0) {
                setActiveWsEvent(null);
            }
        }
    }, [webSocketEvents, secondList]);


    useEffect(() => {
        if (!isOver && webSocketEvents.length > 0) {
            const newEvent = webSocketEvents[0];
            const eventType = newEvent.type;
            const clrDtm = newEvent.clrDtm;

            if (eventType.includes("gas")) {
                if (!eventType.includes("01")) {
                    if (clrDtm === "") {
                        // 2단계 발생, 3단계 발생일 경우, 기존에 있던 1단계 해제 혹은 2단계 해제를 제외하고 상단에 표출한다.
                        let newEventList = eventList.filter((item) => item.seqn !== newEvent.seqn);
                        newEventList = [newEvent, ...newEventList];
                        setEventList(newEventList);

                        setActiveEvent(newEvent);
                        setWebSocketEvents(webSocketEvents.filter((item) => item.seqn !== newEvent.seqn));

                        if (alarmOn) {
                            setActiveTab(LEFT_MENU_EVENT);
                        }
                    } else {
                        let newEventList = eventList.map((item) => item.seqn === newEvent.seqn ? newEvent : item);
                        setEventList(newEventList);
                        setWebSocketEvents(webSocketEvents.filter((item) => item.seqn !== newEvent.seqn));

                    }
                } else {
                    if (clrDtm === "") {
                        let newEventList = [newEvent, ...eventList];
                        setEventList(newEventList);
                        setActiveEvent(newEvent);
                        setWebSocketEvents(webSocketEvents.filter((item) => item.seqn !== newEvent.seqn));
                        if (alarmOn) {
                            setActiveTab(LEFT_MENU_EVENT);
                        }

                    } else {
                        let newEventList = eventList.map((item) => item.seqn === newEvent.seqn ? newEvent : item);
                        setEventList(newEventList);
                        setWebSocketEvents(webSocketEvents.filter((item) => item.seqn !== newEvent.seqn));

                    }

                }
            } else {
                // 화재, 불꽃감지일 경우
                if (clrDtm === "") {
                    let newEventList = [newEvent, ...eventList];
                    setEventList(newEventList);

                    setActiveEvent(newEvent);

                    setWebSocketEvents(webSocketEvents.filter((item) => item.seqn !== newEvent.seqn));

                    if (alarmOn) {
                        setActiveTab(LEFT_MENU_EVENT);
                    }

                } else {
                    let newEventList = eventList.map((item) => item.seqn === newEvent.seqn ? newEvent : item);
                    setEventList(newEventList);
                    setWebSocketEvents(webSocketEvents.filter((item) => item.seqn !== newEvent.seqn));
                }
            }
        }
    }, [isOver, activeWsEvent])

    useEffect(() => {
        if (activeWsEvent) {
            // 발생이면
            if (activeWsEvent.clrDtm === '') {
                if (activeWsEvent.type !== "gas03") {
                    const toastEventSeqns = toastEventList.map((item) => item.seqn);
                    if (!toastEventSeqns.includes(activeWsEvent.seqn)) {
                        const newEventToastList = [...toastEventList];
                        const newSeconds = [...secondList];
                        newEventToastList.push(activeWsEvent);
                        //30초
                        newSeconds.push(30);
                        if (newEventToastList.length >= 3) {
                            newEventToastList.shift();
                            newSeconds.shift();
                        }
                        setToastEventList(newEventToastList);
                        setSecondList(newSeconds);
                    }
                }
            }
        }
    }, [activeWsEvent]);


    useEffect(() => {
        const timer = setInterval(() => {
            if (secondList.length > 0) {
                const newSeconds: number[] = [];
                const newEvents: EVENT_TYPE[] = [];
                secondList.forEach((second, index) => {
                    if (second > 0) {
                        newSeconds.push(second - 1);
                        newEvents.push(toastEventList[index]);
                    }
                });
                setSecondList(newSeconds);
                setToastEventList(newEvents);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [secondList]);


    const setEventNmForm = (eventType: string) => {
        switch (eventType) {
            case EVENT_TYPE_FIRE.cd:
                return "화재 감지";
            case EVENT_TYPE_FLAME.cd:
                return "불꽃 감지";
            default:
                return "가스 감지";
        }
    }

    const clsBtn = (idx: number) => {
        let newFilter = toastEventList.filter((_, index) => index !== idx);
        setToastEventList(newFilter);
    }

    const handleToast = (event: EVENT_TYPE, idx: number) => {
        setActiveEvent(event);
        if (activeTab.cd !== LEFT_MENU_EVENT.cd) {
            setActiveTab(LEFT_MENU_EVENT);
        }
        clsBtn(idx);
    }


    return (
        <div className="toast-event">
            {
                alarmOn &&
                toastEventList.map((item, index) => (
                    <div id="toast-event" className={`toast-event__item toast-event__item--${item.type} `}
                         onClick={() => handleToast(item, index)}>
                        <i className="toast-event__icon"></i>
                        <div className="toast-event__message">
                            <div className="message">
                                <p>{item.mappBuildingId} {setEventNmForm(item.type)}</p>
                                {
                                    item.type.includes("gas") &&
                                    <p className="step">{item.type.substring(item.type.length - 1)}단계</p>
                                }
                            </div>
                            <p className="date">{moment(item.outbDtm, 'YYYYMMDDHHmmssSSS').format("YYYY-MM-DD HH:mm:ss")}</p>
                        </div>
                        <button type="button" className="btn-close btn-close-02" onClick={() => clsBtn(index)}></button>
                    </div>
                ))
            }

        </div>
    )

}

export default EventToast