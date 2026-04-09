import {useGisStore} from "../../../../store_back/zustand/gis.ts";
import {useShallow} from "zustand/react/shallow";
import {useLeftStore} from "../../../../store_back/zustand/left.ts";
import {
    PATROL_TIME_FIFTY_SECONDS,
    PATROL_TIME_FOURTY_SECONDS,
    PATROL_TIME_ONE_MINUTE,
    PATROL_TIME_TEN_SECONDS,
    PATROL_TIME_THIRTY_SECONDS,
    PATROL_TIME_TWENTY_SECONDS
} from "../../../../data_back/const/common.ts";
import {useState} from "react";
import WebRTCNew from "./WebRTCNew.tsx";

const PatrolFullPlayerBox = () => {

    const {setActiveFullPatrol,activeFullPatrol}= useGisStore(useShallow((state)=> ({
        setActiveFullPatrol : state.actions.setActiveFullPatrol,
        activeFullPatrol : state.activeFullPatrol,

    })));

    const {activePatrolCctvList,  activePatrolCctvIndex, setActivePatrolCctvIndex, activePatrolFullTime, setActivePatrolFullTime, activePatrolPlayTime, setActivePatrolPlayTime} = useLeftStore(useShallow((state) => ({
        activePatrolCctvList: state.activePatrolCctvList,
        activePatrolCctvIndex: state.activePatrolCctvIndex,
        setActivePatrolCctvIndex: state.actions.setActivePatrolCctvIndex,
        activePatrolFullTime: state.activePatrolFullTime,
        setActivePatrolFullTime: state.actions.setActivePatrolFullTime,
        activePatrolPlayTime: state.activePatrolPlayTime,
        setActivePatrolPlayTime: state.actions.setActivePatrolPlayTime,
    })))

    const TIME_LIST = [PATROL_TIME_TEN_SECONDS,PATROL_TIME_TWENTY_SECONDS, PATROL_TIME_THIRTY_SECONDS, PATROL_TIME_FOURTY_SECONDS, PATROL_TIME_FIFTY_SECONDS, PATROL_TIME_ONE_MINUTE];
    const [isTimeOpen, setIsTimeOpen] = useState<boolean>(false);

    const handlePrevBtn = () => {
        if(activePatrolCctvIndex === 0){
            setActivePatrolCctvIndex(activePatrolCctvList.length -1);
        }else{
            setActivePatrolCctvIndex(activePatrolCctvIndex-1);
        }
        setActivePatrolCctvIndex(0);

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


    return (
        <>
            {
                activePatrolCctvList.length > 0 &&
                <div id="modal-patrol" className={`modal cctv ${activeFullPatrol !== null ?'' : 'hidden'}`} style={{zIndex:'1005'}}>
                    <div className="dimmed"></div>
                    <div className="cctv__layer cctv__layer--patrol cctv__layer--in ">
                        <div className="cctv__layer__head">
                            <div className="frame">
                                <div className="num">{activePatrolCctvIndex+1}</div>
                                <p>{activePatrolCctvList[activePatrolCctvIndex].cctvNm}</p>
                            </div>
                            <button type="button" className="btn-close modal-close" onClick={()=> setActiveFullPatrol(null)}></button>
                        </div>
                        <div className="cctv__layer__body">
                            <div className=" cctv__in">
₩
                                <WebRTCNew cctvId={activePatrolCctvList[activePatrolCctvIndex].streamId+"_HIGH"}/>
                            </div>
                            <button type="button" className="btn-minimize modal-close" onClick={()=> setActiveFullPatrol(null)}></button>
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
                                <div className={`select-box top ${isTimeOpen ? 'active' : ''}`}>
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
                </div>
            }
        </>

    )

}

export default PatrolFullPlayerBox