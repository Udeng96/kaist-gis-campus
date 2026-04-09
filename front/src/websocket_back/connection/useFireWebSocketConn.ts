import {useFireStomp} from "../stomp/useFireStomp.ts";
import {COMMON_CONTEXT} from "../../data_back/api/common/commonUrl.ts";
import {useShallow} from "zustand/react/shallow";
import {useMainStore} from "../../store_back/zustand/main.ts";
import type {EVENT_TYPE} from "../../data_back/interface/leftInterface.tsx";
import moment from "moment";

export const UseFireWebSocketConn = () => {
    const {setActiveWsEvent} = useMainStore(useShallow((state) => ({
        setActiveWsEvent: state.actions.setActiveWsEvent,
    })))

    useFireStomp(COMMON_CONTEXT.WEB_SOCKET.FIRE, [
        {
            topic: '/event/fire',
            handler: (message: EVENT_TYPE) => {
                console.log("화재 이벤트 수신 ::", message);

                    if(Array.isArray(message)){
                        if(message[0].outbDtm.startsWith(moment().format("YYYYMMDD"))){
                            setActiveWsEvent(message[0]);
                        }
                    }else{
                        if(message.outbDtm.startsWith(moment().format("YYYYMMDD"))){
                            setActiveWsEvent(message);
                        }
                    }
            }
        }
    ])
}