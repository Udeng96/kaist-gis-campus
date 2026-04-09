import {useMainStore} from "../../../../../../store_back/zustand/main.ts";
import {
    EVENT_TYPE_FIRE,
    EVENT_TYPE_FLAME,
    EVENT_TYPE_GAS,
    LEFT_CAMPUS_E,
    LEFT_CAMPUS_N,
    LEFT_CAMPUS_W,
    LEFT_CAMPUS_WHOLE,
    MODAL_NONE,
    RIGHT_MOD_EVENT_CCTV,
    RIGHT_MOD_EVENT_REGI,
    RIGHT_MOD_NONE,
    TOAST_TYPE
} from "../../../../../../data_back/const/common.ts";
import {useLeftStore} from "../../../../../../store_back/zustand/left.ts";
import {useShallow} from "zustand/react/shallow";
import {useRightStore} from "../../../../../../store_back/zustand/right.ts";
import {useEffect, useState} from "react";
import moment from "moment/moment";
import DatePicker from "tui-date-picker";
import type {BUILDING_TYPE, EVENT_TYPE} from "../../../../../../data_back/interface/leftInterface.tsx";
import type {SensorType} from "../../../../../../data_back/interface/ccomonInterface.ts";
import {useMutation} from "@tanstack/react-query";
import {fetchPassiveRegi} from "../../../../../../data_back/api/right/rightApi.ts";

const Passive = () => {

    const {
        activeEvent,
        lastEventParam,
        buildingList,
        cctvList,
        eventList,
        setEventList
    } = useLeftStore(useShallow((state) => ({
        activeEvent: state.activeEvent,
        lastEventParam: state.lastEventParam,
        buildingList: state.buildingList,
        cctvList: state.cctvList,
        eventList: state.eventList,
        setEventList: state.actions.setEventList,

    })));
    const {
        activeRightEventMod,
        setActiveRightEventMod,
        activeModal,
        setActiveModal,
        setActiveToast,
        sensors
    } = useMainStore(useShallow((state) => ({
        activeRightEventMod: state.activeRightEventMod,
        setActiveRightEventMod: state.actions.setActiveRightEventMod,
        activeModal: state.activeModal,
        setActiveModal: state.actions.setActiveModal,
        setActiveToast: state.actions.setActiveToast,
        sensors: state.sensors
    })));

    const {
        regiEventPassiveType,
        regiEventPassiveLevel,
        regiEventPassiveDtm,
        regiEventPassiveHour,
        regiEventPassiveMinute,
        regiEventPassiveSecond,
        regiEventPassiveArea,
        regiEventPassiveBuilding,
        regiEventPassiveSensor,
        setRegiEventPassiveType,
        setRegiEventPassiveLevel,
        setRegiEventPassiveDtm,
        setRegiEventPassiveHour,
        setRegiEventPassiveMinute,
        setRegiEventPassiveSecond,
        setRegiEventPassiveArea,
        setRegiEventPassiveBuilding,
        setRegiEventPassiveSensor,
    } = useRightStore(useShallow((state) => ({
        regiEventPassiveType: state.regiEventPassiveType,
        regiEventPassiveLevel: state.regiEventPassiveLevel,
        regiEventPassiveDtm: state.regiEventPassiveDtm,
        regiEventPassiveHour: state.regiEventPassiveHour,
        regiEventPassiveMinute: state.regiEventPassiveMinute,
        regiEventPassiveSecond: state.regiEventPassiveSecond,
        regiEventPassiveArea: state.regiEventPassiveArea,
        regiEventPassiveBuilding: state.regiEventPassiveBuilding,
        regiEventPassiveSensor: state.regiEventPassiveSensor,
        setRegiEventPassiveType: state.actions.setRegiEventPassiveType,
        setRegiEventPassiveLevel: state.actions.setRegiEventPassiveLevel,
        setRegiEventPassiveDtm: state.actions.setRegiEventPassiveDtm,
        setRegiEventPassiveHour: state.actions.setRegiEventPassiveHour,
        setRegiEventPassiveMinute: state.actions.setRegiEventPassiveMinute,
        setRegiEventPassiveSecond: state.actions.setRegiEventPassiveSecond,
        setRegiEventPassiveArea: state.actions.setRegiEventPassiveArea,
        setRegiEventPassiveBuilding: state.actions.setRegiEventPassiveBuilding,
        setRegiEventPassiveSensor: state.actions.setRegiEventPassiveSensor
    })))

    const EVENT_TYPE_LIST = [EVENT_TYPE_GAS, EVENT_TYPE_FIRE, EVENT_TYPE_FLAME];
    const AREA_LIST = [LEFT_CAMPUS_WHOLE, LEFT_CAMPUS_N, LEFT_CAMPUS_W, LEFT_CAMPUS_E];

    const HOUR_LIST: string[] = Array.from({length: 24}, (_, i) => moment().hour(i).format('HH'));
    const MINUTE_LIST: string[] = Array.from({length: 60}, (_, i) => moment().minute(i).format('mm'));
    const SECOND_LIST: string[] = Array.from({length: 60}, (_, i) => moment().second(i).format('ss'));

    const [isHourOpen, setIsHourOpen] = useState<boolean>(false);
    const [isMinOpen, setIsMinOpen] = useState<boolean>(false);
    const [isSecondOpen, setIsSecondOpen] = useState<boolean>(false);
    const [isBuildingOpen, setIsBuildingOpen] = useState<boolean>(false);
    const [isSensorOpen, setIsSensorOpen] = useState<boolean>(false);
    const [selectSensorList, setSelectSensorList] = useState<SensorType[]>([]);

    useEffect(() => {
        if (activeRightEventMod.cd === RIGHT_MOD_EVENT_REGI.cd) {
            const inputEl = document.getElementById("datepicker-input-01") as HTMLInputElement;
            const containerEl = document.getElementById("datepicker-container-01");

            if (inputEl && containerEl) {
                const eventPicker = new DatePicker(containerEl, {
                    language: 'ko',
                    date: moment(regiEventPassiveDtm, "YYYYMMDD").toDate(),
                    input: {
                        element: inputEl,
                        format: "yyyy-MM-dd"
                    },
                });

                eventPicker.on('change', () => {
                    const selectedDate = moment(eventPicker.getDate()).format("YYYYMMDD");
                    setRegiEventPassiveDtm(selectedDate);
                });

                eventPicker.setRanges([
                    [new Date(1900, 0, 1), new Date()]
                ]);
            }
        }
    }, [activeRightEventMod]);

    useEffect(() => {
        if (sensors) {
            let sensorList: SensorType[] = [];
            if (regiEventPassiveType.cd === EVENT_TYPE_GAS.cd) {
                sensorList = sensors.gasSensors;
            } else if (regiEventPassiveType.cd === EVENT_TYPE_FIRE.cd) {
                sensorList = sensors.fireSensors;
            } else {
                sensorList = sensors.flameSensors;
            }

            if (sensorList.length > 0) {
                if (regiEventPassiveArea.cd !== LEFT_CAMPUS_WHOLE.cd) {
                    sensorList = sensorList.filter((sensor) => sensor.building.includes(regiEventPassiveArea.cd));
                }

                if (regiEventPassiveBuilding) {
                    const newSensorList: SensorType[] = [];
                    sensorList.forEach((sensor) => {
                        if (sensor.building.split(", ").includes(regiEventPassiveBuilding.id)) {
                            newSensorList.push(sensor);
                        }
                    })

                    setSelectSensorList(newSensorList);
                }
            }

            setSelectSensorList(sensorList);
        }
    }, [sensors, regiEventPassiveBuilding, regiEventPassiveType, regiEventPassiveArea])

    useEffect(() => {
        if (activeRightEventMod.cd !== RIGHT_MOD_EVENT_REGI.cd) {
            resetPassive();
        }
    }, [activeRightEventMod]);

    useEffect(() => {

        if (activeModal.cd === 'EVENT_EXIT_CONFIRM_OK') {
            resetPassive();
            setActiveModal(MODAL_NONE);
        }

    }, [activeModal]);

    const resetPassive = () => {
        if (activeEvent !== null) {
            setActiveRightEventMod(RIGHT_MOD_EVENT_CCTV);

        } else {
            setActiveRightEventMod(RIGHT_MOD_NONE);
        }

        setRegiEventPassiveType(EVENT_TYPE_GAS);
        setRegiEventPassiveLevel(1);
        setRegiEventPassiveDtm(moment().format("YYYYMMDD"));
        setRegiEventPassiveHour(moment().format("HH"));
        setRegiEventPassiveMinute(moment().format("mm"));
        setRegiEventPassiveSecond(moment().format("ss"));
        setRegiEventPassiveArea(LEFT_CAMPUS_WHOLE);
        setRegiEventPassiveBuilding(null);
        setRegiEventPassiveSensor(null);

        setIsSensorOpen(false);
        setIsBuildingOpen(false);
        setIsHourOpen(false);
        setIsSecondOpen(false);
        setIsMinOpen(false);
    }

    const handleCls = () => {
        setActiveModal({cd: 'EVENT_EXIT_CONFIRM', nm: '이벤트 종료'})
    }

    const handleBuilding = (building: BUILDING_TYPE | null) => {
        setIsBuildingOpen(!isBuildingOpen);
        setRegiEventPassiveBuilding(building);
    }

    const handleHour = (hour: string) => {
        setIsHourOpen(!isHourOpen);
        setRegiEventPassiveHour(hour);
    }

    const handleMin = (min: string) => {
        setIsMinOpen(!isMinOpen);
        setRegiEventPassiveMinute(min);
    }

    const handleSecond = (second: string) => {
        setIsSecondOpen(!isSecondOpen);
        setRegiEventPassiveSecond(second);
    }

    const handleArea = (area: { cd: string, nm: string }) => {
        setRegiEventPassiveArea(area);
        setRegiEventPassiveBuilding(null);
        setRegiEventPassiveSensor(null)
        setIsBuildingOpen(false);
        setIsSensorOpen(false);
    }

    const handleSensor = (sensor: SensorType) => {
        setIsSensorOpen(false);
        setRegiEventPassiveSensor(sensor);
    }

    const handleSaveBtn = () => {
        if (regiEventPassiveBuilding && regiEventPassiveSensor) {
            const mappCctvList = cctvList.filter((cctv) => cctv.building.split(", ").includes(regiEventPassiveBuilding?.id));
            const mappCctvIds = mappCctvList.map((cctv) => cctv.streamId);

            const newEvent: EVENT_TYPE = {
                seqn: '',
                type: regiEventPassiveType.cd.includes("gas") ? regiEventPassiveType.cd + "0" + regiEventPassiveLevel : regiEventPassiveType.cd,
                outbDtm: regiEventPassiveDtm + regiEventPassiveHour + regiEventPassiveMinute + regiEventPassiveSecond,
                clrDtm: '',
                mappBuildingId: regiEventPassiveBuilding.id,
                mappCctvId: mappCctvIds.join(", "),
                mappSensorId: regiEventPassiveSensor.cd,
            }

            saveEventMutation.mutate(newEvent);
        }
    }

    const saveEventMutation = useMutation({
        mutationFn: fetchPassiveRegi,
        onSuccess: (data) => {
            if (data !== null) {
                const newEvent = data as EVENT_TYPE;
                setActiveToast({cd: TOAST_TYPE.SUCCESS, msg: '수동 이벤트 등록에 성공했습니다.'})
                if (lastEventParam !== null) {
                    if (lastEventParam.eventType === 'whole' || newEvent.type === lastEventParam.eventType) {
                        if (lastEventParam.eventArea === 'WHOLE' || newEvent.mappBuildingId.includes(lastEventParam.eventArea)) {
                            setEventList([newEvent, ...eventList]);
                        }
                    }
                } else {
                    setEventList([newEvent, ...eventList]);
                }
            } else {
                setActiveToast({cd: TOAST_TYPE.ERROR, msg: '수동 이벤트 등록에 실패했습니다.'})
            }

            resetPassive();
        }
    })

    const handleBuildBtn = () => {
        setIsBuildingOpen(!isBuildingOpen);
        setIsSecondOpen(false);
        setIsMinOpen(false);
        setIsHourOpen(false);
        setIsSensorOpen(false);
    }

    const handleSensorBtn = () => {
        setIsSensorOpen(!isSensorOpen);
        setIsBuildingOpen(false);
        setIsSecondOpen(false);
        setIsMinOpen(false);
        setIsHourOpen(false);
    }

    const handleSecondBtn = () => {
        setIsSecondOpen(!isSecondOpen);
        setIsMinOpen(false);
        setIsHourOpen(false);
        setIsBuildingOpen(false);
        setIsSensorOpen(false);
    }

    const handleMinBtn = () => {
        setIsMinOpen(!isMinOpen);
        setIsSecondOpen(false);
        setIsHourOpen(false);
        setIsBuildingOpen(false);
        setIsSensorOpen(false);
    }

    const handleHourBtn = () => {
        setIsHourOpen(!isHourOpen);
        setIsSecondOpen(false);
        setIsMinOpen(false);
        setIsBuildingOpen(false);
        setIsSensorOpen(false);
    }

    return (
        <div
            className={`content__frame content__frame--register addEvent ${activeRightEventMod.cd === RIGHT_MOD_EVENT_REGI.cd ? 'active' : ''}`}>
            <div className="content__frame__head">
                <h3>수동 이벤트 등록</h3>
                <button type="button" className="btn-close btn-close-02 content-close" onClick={handleCls}></button>
            </div>
            <div className="content__frame__body">
                <div className="container">
                    <div className="frame">
                        <p className="label">이벤트 유형</p>
                        <div className="value">
                            <div className="sub-tab__wrap-2">
                                {
                                    EVENT_TYPE_LIST.map((eventType) => (
                                        <button key={'REGI_EVENT ' + eventType.cd} type="button"
                                                className={`sub-tab ${eventType.cd === regiEventPassiveType.cd ? 'active' : ''}`}
                                                onClick={() => setRegiEventPassiveType(eventType)}>{eventType.nm}</button>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                    <div className="frame">
                        <p className="label">이벤트 단계</p>
                        <div className="value">
                            <div className="checkbox-wrap">
                                <label className="checkbox">
                                    <input type="radio" name="step" checked={regiEventPassiveLevel === 1}
                                           onChange={() => setRegiEventPassiveLevel(1)}
                                           disabled={regiEventPassiveType.cd !== EVENT_TYPE_GAS.cd}/>
                                    <span className="checkmark"></span>
                                    <p className="name">1단계</p>
                                </label>
                                <label className="checkbox">
                                    <input type="radio" name="step" checked={regiEventPassiveLevel === 2}
                                           onChange={() => setRegiEventPassiveLevel(2)}
                                           disabled={regiEventPassiveType.cd !== EVENT_TYPE_GAS.cd}/>
                                    <span className="checkmark"></span>
                                    <p className="name">2단계</p>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="frame">
                        <p className="label">발생 일시</p>
                        <div className="value">
                            <div className="datepicker__wrap full">
                                <div className="tui-datepicker-input datepicker ">
                                    <input id="datepicker-input-01" className="datepicker__input" type="text"
                                           aria-label="Date"/>
                                    <i className="datepicker__icon"></i>
                                </div>
                                <div id="datepicker-container-01"></div>
                            </div>
                        </div>
                        <div className="value frame-wrap">
                            <div className="frame">
                                <div className={`select-box mini ${isHourOpen ? 'active' : ''}`}>
                                    <button className={`btn--select  ${isHourOpen ? 'active' : ''}`}
                                            onClick={() => handleHourBtn()}>{regiEventPassiveHour}</button>
                                    <div className={`drop-down ${isHourOpen ? 'active' : ''}`}>
                                        <ul className="ct-scroll">
                                            {
                                                HOUR_LIST.map((hour) => (
                                                    <li className={`select__item ${hour === regiEventPassiveHour ? 'selected' : ''}`}
                                                        onClick={() => handleHour(hour)}>
                                                        <button>{hour}</button>
                                                    </li>
                                                ))
                                            }
                                        </ul>
                                    </div>
                                </div>
                                시
                            </div>
                            <div className="frame">
                                <div className={`select-box mini ${isMinOpen ? 'active' : ''}`}>
                                    <button className={`btn--select  ${isMinOpen ? 'active' : ''}`}
                                            onClick={() => handleMinBtn()}>{regiEventPassiveMinute}</button>
                                    <div className={`drop-down ${isMinOpen ? 'active' : ''}`}>
                                        <ul className="ct-scroll">
                                            {
                                                MINUTE_LIST.map((min) => (
                                                    <li className={`select__item ${min === regiEventPassiveMinute ? 'selected' : ''}`}
                                                        onClick={() => handleMin(min)}>
                                                        <button>{min}</button>
                                                    </li>
                                                ))
                                            }
                                        </ul>
                                    </div>
                                </div>
                                분
                            </div>
                            <div className="frame">
                                <div className={`select-box mini ${isSecondOpen ? 'active' : ''}`}>
                                    <button className={`btn--select  ${isSecondOpen ? 'active' : ''}`}
                                            onClick={() => handleSecondBtn()}>{regiEventPassiveSecond}</button>
                                    <div className={`drop-down ${isSecondOpen ? 'active' : ''}`}>
                                        <ul className="ct-scroll">
                                            {
                                                SECOND_LIST.map((second) => (
                                                    <li className={`select__item ${second === regiEventPassiveSecond ? 'selected' : ''}`}
                                                        onClick={() => handleSecond(second)}>
                                                        <button>{second}</button>
                                                    </li>
                                                ))
                                            }
                                        </ul>
                                    </div>
                                </div>
                                초
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container">
                    <div className="container__head">
                        <h4>이벤트 위치</h4>
                    </div>
                    <div className="frame">
                        <p className="label">캠퍼스 구역</p>
                        <div className="value">
                            <div className="sub-tab__wrap-2">
                                {
                                    AREA_LIST.map((area) => (
                                        <button type="button"
                                                className={`sub-tab ${area.cd === regiEventPassiveArea.cd ? 'active' : ''}`}
                                                onClick={() => handleArea(area)}>{area.nm}</button>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                    <div className="frame">
                        <div className="frame__head">
                            <p className="label ">건물 명</p>
                        </div>
                        <div className="value">
                            <div className={`select-box ${isBuildingOpen ? 'active' : ''}`}>
                                <button className={`btn--select`}
                                        onClick={() => handleBuildBtn()}>{regiEventPassiveBuilding ? regiEventPassiveBuilding.name : '선택'}</button>
                                <div className={`drop-down ${isBuildingOpen ? 'active' : ''}`}>
                                    <ul className="ct-scroll">
                                        {
                                            buildingList.filter((building) => regiEventPassiveArea.cd !== 'WHOLE' ? building.id.includes(regiEventPassiveArea.cd) : true).map((building) => (
                                                <li className={`select__item ${regiEventPassiveBuilding && (building.id === regiEventPassiveBuilding.id) ? 'selected' : ''}`}
                                                    onClick={() => handleBuilding(building)}>
                                                    <button>{building.name}</button>
                                                </li>
                                            ))
                                        }
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="frame">
                        <div className="frame__head">
                            <p className="label ">센서</p>
                        </div>
                        <div className="value">
                            <div className={`select-box ${isSensorOpen ? 'active' : ''}`}>
                                <button className={`btn--select`}
                                        onClick={() => handleSensorBtn()}>{regiEventPassiveSensor ? regiEventPassiveSensor.nm : '선택'}</button>
                                <div className={`drop-down ${isSensorOpen ? 'active' : ''}`}>
                                    <ul className="ct-scroll">
                                        {
                                            selectSensorList.map((sensor) => (
                                                <li className={`select__item ${regiEventPassiveSensor && (sensor.cd === regiEventPassiveSensor.cd) ? 'selected' : ''}`}
                                                    onClick={() => handleSensor(sensor)}>
                                                    <button>{sensor.nm}</button>
                                                </li>
                                            ))
                                        }
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="content__frame__footer content__frame__footer--end">
                <div className="frame">
                    <button type="button" className="btn btn-normal content-close" onClick={handleCls}>취소</button>
                    <button type="button" className="btn btn-primary"
                            disabled={regiEventPassiveBuilding === null || regiEventPassiveSensor === null}
                            onClick={handleSaveBtn}>등록
                    </button>
                </div>
            </div>
        </div>
    )

}

export default Passive