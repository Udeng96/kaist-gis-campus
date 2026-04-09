import {COMMON_CONTEXT} from "../../data_back/api/common/commonUrl.ts";
import type {EVENT_TYPE} from "../../data_back/interface/leftInterface.tsx";
import {useMainStore} from "../../store_back/zustand/main.ts";
import {useShallow} from "zustand/react/shallow";
import {useGasStomp} from "../stomp/useGasStomp.ts";
import moment from "moment";

export const UseGasWebSocketConn = () => {

    const {setActiveWsEvent} = useMainStore(useShallow((state) => ({
        setActiveWsEvent: state.actions.setActiveWsEvent,
    })))

    useGasStomp(COMMON_CONTEXT.WEB_SOCKET.GAS, [
        {
            topic: '/event/gas',
            handler: (message: EVENT_TYPE) => {
                console.log("가스 이벤트 수신::", message);
                if(message.outbDtm.startsWith(moment().format("YYYYMMDD"))){
                    setActiveWsEvent(message)
                }
            }
        }
    ])
}