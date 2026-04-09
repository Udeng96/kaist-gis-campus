import {useLeftStore} from "../../../../../../../../store_back/zustand/left.ts";
import {useShallow} from "zustand/react/shallow";
import {EVENT_TYPE_WHOLE, LEFT_CAMPUS_WHOLE} from "../../../../../../../../data_back/const/common.ts";

const FilterFoot = () => {

    const {setEventSearchArea, setEventSearchType, eventSearchArea, eventSearchType, setEventSearchParam, setLastEventParam} = useLeftStore(useShallow((state)=> ({
        setEventSearchArea : state.actions.setEventSearchArea,
        setEventSearchType : state.actions.setEventSearchType,
        eventSearchArea : state.eventSearchArea,
        eventSearchType : state.eventSearchType,
        setEventSearchParam : state.actions.setEventSearchParam,
        setLastEventParam : state.actions.setLastEventParam
    })))

    const handleReset = () => {
        setEventSearchArea(LEFT_CAMPUS_WHOLE);
        setEventSearchType(EVENT_TYPE_WHOLE);
    }

    const handleSearch = () => {
        setEventSearchParam({eventArea : eventSearchArea.cd, eventType:eventSearchType.cd});
        setLastEventParam({eventArea : eventSearchArea.cd, eventType:eventSearchType.cd});
    }

    return(
        <div className="filter__footer">
            <button type="button" className="btn btn-normal btn-reset" onClick={handleReset}>초기화</button>
            <button type="button" className="btn btn-primary btn-check" onClick={handleSearch}>조회</button>
        </div>
    )

}

export default FilterFoot