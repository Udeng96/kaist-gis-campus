import {useGisStore} from "../../../../store_back/zustand/gis.ts";
import {useShallow} from "zustand/react/shallow";
import {useLeftStore} from "../../../../store_back/zustand/left.ts";
import {useEffect, useState} from "react";
import type {CCTV_TYPE} from "../../../../data_back/interface/leftInterface.tsx";
import {
    LEFT_MOD_PATROL,
    PATROL_TIME_FIFTY_SECONDS,
    PATROL_TIME_FOURTY_SECONDS,
    PATROL_TIME_ONE_MINUTE,
    PATROL_TIME_TEN_SECONDS,
    PATROL_TIME_THIRTY_SECONDS,
    PATROL_TIME_TWENTY_SECONDS
} from "../../../../data_back/const/common.ts";
import {useMainStore} from "../../../../store_back/zustand/main.ts";
import WebRTCNew from "./WebRTCNew.tsx";

const PatrolPlayerBox = () => {
    const activeMod = useMainStore((state)=> state.activeMod);

    const {cctvList, activePatrol, setActivePatrol, activePatrolCctvList, setActivePatrolCctvList, activePatrolCctvIndex, setActivePatrolCctvIndex, activePatrolFullTime, setActivePatrolFullTime, activePatrolPlayTime, setActivePatrolPlayTime} = useLeftStore(useShallow((state) => ({
        cctvList: state.cctvList,
        activePatrol: state.activePatrol,
        setActivePatrol: state.actions.setActivePatrol,
        activePatrolCctvList: state.activePatrolCctvList,
        setActivePatrolCctvList: state.actions.setActivePatrolCctvList,
        activePatrolCctvIndex: state.activePatrolCctvIndex,
        setActivePatrolCctvIndex: state.actions.setActivePatrolCctvIndex,
        activePatrolFullTime: state.activePatrolFullTime,
        setActivePatrolFullTime: state.actions.setActivePatrolFullTime,
        activePatrolPlayTime: state.activePatrolPlayTime,
        setActivePatrolPlayTime: state.actions.setActivePatrolPlayTime,
    })))
    const {setActiveFullPatrol, activeFullPatrol} = useGisStore(useShallow((state) => ({
        setActiveFullPatrol: state.actions.setActiveFullPatrol,
        activeFullPatrol : state.activeFullPatrol
    })));

    const TIME_LIST = [PATROL_TIME_TEN_SECONDS,PATROL_TIME_TWENTY_SECONDS, PATROL_TIME_THIRTY_SECONDS, PATROL_TIME_FOURTY_SECONDS, PATROL_TIME_FIFTY_SECONDS, PATROL_TIME_ONE_MINUTE];
    const [isTimeOpen, setIsTimeOpen] = useState<boolean>(false);


    useEffect(() => {
        if (activeMod.cd === LEFT_MOD_PATROL.cd && activePatrol) {
            setActivePatrolPlayTime(0);
            if (cctvList.length > 0) {
                const newPatrolCctvs: CCTV_TYPE[] = [];
                const activePatrolCctvs = activePatrol.cctvMappId.split(", ");
                activePatrolCctvs.map((item) => {
                    const streamId = item.split("/")[1];
                    const area = item.split("/")[0];

                    const cctv = cctvList.find((cctvItem) => cctvItem.streamId === streamId);
                    if (cctv) {
                        cctv.building = area;
                        newPatrolCctvs.push(cctv)
                    }
                })
                setActivePatrolCctvList(newPatrolCctvs);
            } else {
                setActivePatrolCctvList([]);
            }
        } else {
            setActivePatrolCctvList([]);
        }
    }, [activeMod, activePatrol, cctvList]);

    useEffect(() => {
        if (activePatrol === null || activePatrolCctvList.length === 0 ) {
            setActivePatrolPlayTime(0);
            setActivePatrolCctvIndex(0);
            setActivePatrolFullTime(PATROL_TIME_THIRTY_SECONDS);
            return;
        }else{
            const id = setInterval(() => {
                if(activePatrolFullTime.second > activePatrolPlayTime){
                    setActivePatrolPlayTime(activePatrolPlayTime + 1);
                }else{
                    setActivePatrolPlayTime(0);
                    if(activePatrolCctvIndex === activePatrolCctvList.length -1){
                        setActivePatrolCctvIndex(0);
                    }else{
                        setActivePatrolCctvIndex(activePatrolCctvIndex+1);
                    }
                }
            }, 1000);

            return () => clearInterval(id);
        }

    }, [activePatrol, activePatrolFullTime, activePatrolCctvIndex, activePatrolPlayTime, activePatrolCctvList]);

    const handlePrevBtn = () => {
        if(activePatrolCctvIndex === 0){
            setActivePatrolCctvIndex(activePatrolCctvList.length -1);
        }else{
            setActivePatrolCctvIndex(activePatrolCctvIndex-1);
        }

        setActivePatrolPlayTime(0);
    }

    const handleNextBtn = () => {
        if(activePatrolCctvIndex === activePatrolCctvList.length -1){
            setActivePatrolCctvIndex(0);
        }else{
            setActivePatrolCctvIndex(activePatrolCctvIndex+1);
        }
        setActivePatrolPlayTime(0);
    }

    const handleClsBtn = () => {
        setActivePatrol(null);
        setActivePatrolCctvIndex(0);
        setActivePatrolPlayTime(0);
        setActivePatrolFullTime(PATROL_TIME_THIRTY_SECONDS);
        setActivePatrolCctvList([]);
    }

    return (
        <>
            {
                activePatrol !== null &&
                activePatrolCctvList.length > 0 &&
                activeFullPatrol === null &&
                <div className="cctv__layer cctv__layer--patrol cctv__layer--in "
                     style={{top: "92px", right: "70px", zIndex: "99999999"}}>
                    <div className="cctv__layer__head">
                        <div className="frame">
                            <div className="num">{activePatrolCctvIndex+1}</div>
                            <p>{activePatrolCctvList.length > 0 ? activePatrolCctvList[activePatrolCctvIndex].cctvNm : '-'}</p>
                        </div>
                        <button type="button" className="btn-close" onClick={handleClsBtn}></button>
                    </div>
                    <div className="cctv__layer__body">
                        <div className=" cctv__in">
                            <WebRTCNew cctvId={activePatrolCctvList[activePatrolCctvIndex].streamId}/>
                        </div>
                        <button type="button" className="btn-expand"
                                onClick={() => setActiveFullPatrol(activePatrol)}></button>
                    </div>
                    <div className="bar-wrap">
                        <div className="bar" style={{width: `${Math.min(100, Math.round((activePatrolPlayTime / activePatrolFullTime.second) * 100))}%`}}></div>
                    </div>
                    <div className="cctv__layer__footer">
                        <div className="frame">
                            <button type="button" className="btc-prev" onClick={handlePrevBtn}></button>
                            <button type="button" className="btc-next" onClick={handleNextBtn}></button>
                        </div>
                        <div className="frame">
                            전환 시간
                            <div className={`select-box ${isTimeOpen ? 'active' : ''}`}>
                                <button className="btn--select" onClick={() => setIsTimeOpen(!isTimeOpen)}>{activePatrolFullTime.nm}</button>
                                <div className="drop-down ">
                                    <ul>
                                        {
                                            TIME_LIST.map((time) =>(
                                                <li className={`select__item ${activePatrolFullTime.cd === time.cd ? 'selected' : ''}`}>
                                                    <button onClick={() => {setActivePatrolFullTime(time); setActivePatrolPlayTime(0); setIsTimeOpen(false)}}>{time.nm}</button>
                                                </li>
                                            ))
                                        }
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default PatrolPlayerBox