import "../assets/common/css/common.css";
import "../assets/common/css/content.css";
import "../assets/common/css/gis.css";
import "../assets/common/css/header.css";
import "../assets/common/css/modal.css";
import "../assets/common/css/patrol.css";
import "../assets/common/css/selectBox.css";
import "../assets/common/css/toggleBtn.css";
import "../assets/common/css/tree.css";
import "../assets/common/css/tui-date-picker.css";
import "../assets/common/css/tui-tree.css";
import "../assets/common/css/onboarding.css";

import "../assets/dashboard/css/main.css";
import "../assets/dashboard/css/event.css";
import "../assets/common/css/datePicker.css";

import Body from "./body/body.tsx";
import Header from "./header/header.tsx";
import LastEvent from "./modal/event/lastEvent.tsx";
import {UseFlameWebSocketConn} from "../websocket_back/connection/useFlameWebSocketConn.ts";
import BoardMain from "./header/top/board/boardMain.tsx";
import CctvFullPlayerBox from "./body/gis/player/cctvFullPlayerBox.tsx";
import {UseFireWebSocketConn} from "../websocket_back/connection/useFireWebSocketConn.ts";
import {UseGasWebSocketConn} from "../websocket_back/connection/useGasWebSocketConn.ts";

const Root = () => {

    UseFireWebSocketConn();
    UseFlameWebSocketConn();
    UseGasWebSocketConn();

    return (
        <div className={"wrap"}>
            <BoardMain/>
            <CctvFullPlayerBox/>
            <Header/>
            <Body/>
            <LastEvent/>
        </div>
    )

}

export default Root