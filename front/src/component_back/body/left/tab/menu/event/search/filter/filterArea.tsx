import {
    LEFT_CAMPUS_E,
    LEFT_CAMPUS_N,
    LEFT_CAMPUS_W,
    LEFT_CAMPUS_WHOLE
} from "../../../../../../../../data_back/const/common.ts";
import {useLeftStore} from "../../../../../../../../store_back/zustand/left.ts";
import {useShallow} from "zustand/react/shallow";

const FilterArea = () => {

    const EVENT_AREA_LIST = [LEFT_CAMPUS_WHOLE, LEFT_CAMPUS_N, LEFT_CAMPUS_W, LEFT_CAMPUS_E]
    const { eventSearchArea, setEventSearchArea} = useLeftStore(useShallow((state)=> ({
        eventSearchArea : state.eventSearchArea,
        setEventSearchArea : state.actions.setEventSearchArea
    })))

    return(
        <div className="filter__frame">
            <p className="mark label">캠퍼스 구역</p>
            <div className="value">
                <div className="sub-tab__wrap-2">
                    {
                        EVENT_AREA_LIST.map((area)=>(
                            <button type="button" className={`sub-tab ${area.cd ===eventSearchArea.cd ? "active" : ""}`} onClick={()=>setEventSearchArea(area)}>{area.nm}</button>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}
export default FilterArea;