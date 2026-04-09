import {
    CCTV_TYPE_FLAME,
    CCTV_TYPE_IN,
    CCTV_TYPE_OUT,
    EVENT_TYPE_FIRE,
    EVENT_TYPE_FLAME,
    EVENT_TYPE_GAS
} from "../../../../../data_back/const/common.ts";
import {useState} from "react";

const MarkerLegend = () => {

    const [isLegendOpen, setIsLegendOpen] = useState<boolean>(true);
    const CCTV_TYPES = [CCTV_TYPE_IN, CCTV_TYPE_OUT, CCTV_TYPE_FLAME];
    const EVENT_TYPE_LIST = [EVENT_TYPE_GAS, EVENT_TYPE_GAS, EVENT_TYPE_FIRE, EVENT_TYPE_FLAME];

    return (
        <div className={`gis__legend ${isLegendOpen ? 'open' :''}`}>
            <button className="gis__legend__head" onClick={()=>setIsLegendOpen(!isLegendOpen)}>지도 범례</button>
            <div className="gis__legend__body">
                <div className="gis__legend__frame">
                    <p className="gis__legend__title">CCTV</p>
                    <ul className="row">
                        {
                            CCTV_TYPES.map((item) => (
                                <li className="icon__item">
                                    <i className={`ic-cctv-${item.cd}`}></i>
                                    <p>{item.nm}</p>
                                </li>
                            ))
                        }
                    </ul>
                </div>
                <div className="gis__legend__frame">
                    <p className="gis__legend__title">이벤트</p>
                    <ul>
                        {
                            EVENT_TYPE_LIST.map((event,idx)=>(
                                <li className="icon__item">
                                    <i className={`ic-${event.cd}${event.cd==='gas'?`0${idx+1}`:''}`}></i>
                                    <p>{event.nm} {event.cd==='gas' ? ` ${idx+1}단계` : ''}</p>
                                </li>
                            ))
                        }
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default MarkerLegend