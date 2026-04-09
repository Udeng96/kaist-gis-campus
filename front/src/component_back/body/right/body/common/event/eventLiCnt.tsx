import {
    EVENT_TYPE_FIRE,
    EVENT_TYPE_FLAME,
    EVENT_TYPE_GAS,
    EVENT_TYPE_WHOLE
} from "../../../../../../data_back/const/common.ts";
import {useRightStore} from "../../../../../../store_back/zustand/right.ts";
import {useShallow} from "zustand/react/shallow";
import type {EVENT_TYPE} from "../../../../../../data_back/interface/leftInterface.tsx";

const EventLiCnt = (props:{eventList:EVENT_TYPE[]}) => {

    const {activeEventType, setActiveEventType} = useRightStore(useShallow((state)=> ({
        activeEventType : state.activeEventType,
        setActiveEventType : state.actions.setActiveEventType,
    })))
    const EVENT_TYPE_LIST = [EVENT_TYPE_WHOLE, EVENT_TYPE_GAS, EVENT_TYPE_FIRE, EVENT_TYPE_FLAME];

    return(
        <div className="preset-wrap">
            {
                EVENT_TYPE_LIST.map((type, idx)=>(
                    <button type="button" className={`btn-preset ${idx === 0 ? 'all' : ''} ${type.cd === activeEventType.cd ? 'active' : ''}`} onClick={()=>setActiveEventType(type)}>
                        <p className={`name ${type.cd}`}>{type.nm}</p>
                        <p className="value">{props.eventList.filter((event)=> type.cd === EVENT_TYPE_WHOLE.cd ? true :  event.type.includes(type.cd)).length}</p>
                    </button>
                ))
            }
        </div>
    )
}

export default EventLiCnt