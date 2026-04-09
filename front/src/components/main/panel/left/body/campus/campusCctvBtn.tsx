import type {CctvType} from "../../../../../../api/types/facTypes.ts";
import {useCommonStore} from "../../../../../../api/data/common.ts";
import {useCampusStore} from "../../../../../../data/campus.ts";
import {useShallow} from "zustand/react/shallow";

const CampusCctvBtn = (props: { cctv: CctvType , idx: number}) => {

    const CCTV_TYPE_CODE = ["in", "out", "flame"];

    const cctvTypes = useCommonStore().cctvType;
    const {activeBuilding, activeCctv, setActiveCctv} = useCampusStore(useShallow((state)=> ({
        activeBuilding : state.activeBuilding,
        activeCctv : state.activeCctv,
        setActiveCctv : state.actions.setActiveCctv
    })))

    const handleCctv = () => {
        if(activeBuilding === null){
            if(activeCctv !== null){
                if(activeCctv.facInfo.facId === props.cctv.facInfo.facId){
                    setActiveCctv(null);
                }else{
                    setActiveCctv(props.cctv);
                }
            }else{
                setActiveCctv(props.cctv)
            }
        }
    }

    return (
        <li className={`list__item 
        ${CCTV_TYPE_CODE.filter((code)=> code.toLocaleUpperCase() === props.cctv.type)[0]} 
        ${props.idx !== -1 ? 'highlight' : ''}
        ${props.idx === -1 && activeCctv &&( activeCctv.facInfo.facId === props.cctv.facInfo.facId ) ? 'active' : ''}`} onClick={handleCctv}>
            <div>
                <i className="ic-mark">{props.idx === -1 ? '' : props.idx+1}</i>
                {
                    (() => {
                        const idx = CCTV_TYPE_CODE.findIndex((code) => code.toUpperCase() === props.cctv.type);
                        return idx >= 0 && cctvTypes[idx] ? cctvTypes[idx].name.replace("CCTV", "") : props.cctv.type ?? "";
                    })()
                }
            </div>
            <div>{props.cctv.facInfo.facName}</div>
            <div className="frame">
                <button type="button" className={`btc-edit`}></button>
                <button type="button" className={`btn-favorites ${props.cctv.facInfo.isFavorite ? 'active' : ''}`}></button>
            </div>
        </li>
    )

}

export default CampusCctvBtn