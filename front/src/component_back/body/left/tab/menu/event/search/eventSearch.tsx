import EventSearchResult from "./eventSearchResult.tsx";
import EventSearchHead from "./eventSearchHead.tsx";
import EventSearchFilter from "./eventSearchFilter.tsx";

const EventSearch = () => {

    return (
        <>
            <EventSearchHead/>
            <EventSearchFilter/>
            <EventSearchResult/>
        </>
    )
}

export default EventSearch