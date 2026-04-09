import type {CctvType} from "../../../../../api/types/facTypes.ts";
import WebRTCNew from "../../../../../component_back/body/gis/player/WebRTCNew.tsx";

const CctvPlayerBox = (props: { num: number, cctv: CctvType }) => {


    // const {activeEvent} = useLeftStore(useShallow((state)=> ({
    //     activeEvent : state.activeEvent
    // })))
    // const {setActiveFullCctv} = useGisStore(useShallow((state) => ({
    //     setActiveFullCctv: state.actions.setActiveFullCctv
    // })))
    //
    const handleFull = () => {
        // ${activeEvent && activeEvent.mappSensorId === props.cctv.facInfo.facId ? 'active' : ''}

        // setActiveFullCctv(props.cctv)
    }

    return (
        <li className={`cctv__item cctv__item--${props.cctv.type.toLocaleLowerCase()} `} >
            <div className={`cctv__head`}>
                <div className="num">{props.num}</div>
                <p>{props.cctv.facInfo.facName}</p>
            </div>
            <div className="cctv__body">
                <div className=" cctv__in">
                    <WebRTCNew cctvId={props.cctv.facInfo.facId}/>
                </div>
                <button type="button" className="btn-expand" onClick={handleFull}></button>
            </div>
        </li>
    )

}

export default CctvPlayerBox