import type {CCTV_TYPE} from "../../../../../../data_back/interface/leftInterface.tsx";
import {useShallow} from "zustand/react/shallow";
import {useGisStore} from "../../../../../../store_back/zustand/gis.ts";
import WebRTCNew from "../../../../gis/player/WebRTCNew.tsx";
import {useLeftStore} from "../../../../../../store_back/zustand/left.ts";

const PlayerBox = (props: { num: number, cctv: CCTV_TYPE }) => {


    const {activeEvent} = useLeftStore(useShallow((state)=> ({
        activeEvent : state.activeEvent
    })))
    const {setActiveFullCctv} = useGisStore(useShallow((state) => ({
        setActiveFullCctv: state.actions.setActiveFullCctv
    })))

    const handleFull = () => {
        setActiveFullCctv(props.cctv)
    }

    return (
        <li className={`cctv__item cctv__item--${props.cctv.plcType === '1' ? 'in' : props.cctv.plcType === '2' ? 'out' : 'flame'} `} >
            <div className={`cctv__head ${activeEvent && activeEvent.mappSensorId === props.cctv.streamId ? 'active' : ''}`}>
                <div className="num">{props.num}</div>
                <p>{props.cctv.cctvNm}</p>
            </div>
            <div className="cctv__body">
                <div className=" cctv__in">
                    <WebRTCNew cctvId={props.cctv.streamId}/>
                </div>
                <button type="button" className="btn-expand" onClick={handleFull}></button>
            </div>
        </li>
    )

}

export default PlayerBox