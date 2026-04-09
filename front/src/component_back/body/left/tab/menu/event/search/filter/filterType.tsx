import {useState} from "react";
import {
    EVENT_TYPE_FIRE,
    EVENT_TYPE_FLAME,
    EVENT_TYPE_GAS,
    EVENT_TYPE_WHOLE
} from "../../../../../../../../data_back/const/common.ts";
import {useLeftStore} from "../../../../../../../../store_back/zustand/left.ts";
import {useShallow} from "zustand/react/shallow";

const FilterType = () => {

    const EVENT_TYPE_LIST = [EVENT_TYPE_WHOLE, EVENT_TYPE_GAS, EVENT_TYPE_FIRE, EVENT_TYPE_FLAME];
    const [isDrop, setIsDrop] = useState<boolean>(false);
    const {eventSearchType, setEventSearchType} = useLeftStore(useShallow((state)=> ({
        eventSearchType : state.eventSearchType,
        setEventSearchType : state.actions.setEventSearchType
    })))

    const handleType = (type:{cd:string, nm:string}) => {
        setEventSearchType(type);
        setIsDrop(false);
    }
    return(
        <div className="filter__frame">
            <p className="mark label">이벤트 유형</p>
            <div className="value">
                <div className={`select-box ${isDrop? "active" : ""}`}>
                    <button className={`btn--select `} onClick={() => setIsDrop(!isDrop)}>{eventSearchType.nm}</button>
                    <div className={`drop-down `}>
                        <ul className="ct-scroll">
                            {
                                EVENT_TYPE_LIST.map((item)=>(
                                    <li className={`select__item ${eventSearchType.cd === item.cd ? "selected" : ""}`}>
                                        <button onClick={()=>handleType(item)}>{item.nm}</button>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default FilterType