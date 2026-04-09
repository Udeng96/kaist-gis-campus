import EventCnt from "./cnt/eventCnt.tsx";
import EventSearch from "./search/eventSearch.tsx";
import EventLi from "./list/eventLi.tsx";
import {useLeftStore} from "../../../../../../store_back/zustand/left.ts";
import {useShallow} from "zustand/react/shallow";

const Event = () => {
    const {eventList} = useLeftStore(useShallow((state) => ({
        eventList : state.eventList,
    })));



    return (
        <li className={`tab__item tab__item--event active`}>
            <EventCnt/>
            <hr className="divider"/>
            <EventSearch/>
            <EventLi eventList={eventList}/>
        </li>
    )
}

export default Event
