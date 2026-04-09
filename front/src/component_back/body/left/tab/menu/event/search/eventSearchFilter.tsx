import FilterArea from "./filter/filterArea.tsx";
import FilterType from "./filter/filterType.tsx";
import FilterFoot from "./filter/filterFoot.tsx";

const EventSearchFilter = () =>{
    return(
        <div className="filter">
            <FilterArea/>
            <FilterType/>
            <FilterFoot/>
        </div>
    )
}

export default EventSearchFilter