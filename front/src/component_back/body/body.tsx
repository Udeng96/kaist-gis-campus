import Left from "./left/left.tsx";
import Gis from "./gis/gis.tsx";
import Right from "./right/right.tsx";
import PatrolFullPlayerBox from "./gis/player/patrolFullPlayerBox.tsx";
import Toast from "../modal/toast/message/toast.tsx";
import Confirm from "../modal/confirm/confirm.tsx";
import GisToast from "./gis/toast/gisToast.tsx";
import EndBtn from "./gis/func/endBtn.tsx";
import EventToast from "../modal/toast/event/eventToast.tsx";
import EndPatrolBtn from "./gis/func/endPatrolBtn.tsx";

const Body = () => {
    return(
        <main>
            <GisToast/>
            <Toast/>
            <EventToast/>
            <Confirm/>
            <Left/>
            <Gis/>
            <Right/>
            <PatrolFullPlayerBox/>
            <EndBtn/>
            <EndPatrolBtn/>
        </main>
    )

}

export default Body

