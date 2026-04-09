import {MAIN_IP} from "../common/commonUrl.ts";

export const LEFT_CONTEXT = {
    FAVORITE : {
        LIST : MAIN_IP + "/kaist/fac/favorite",
        SYNC : MAIN_IP + "/kaist/fac/favorite"
    },
    BUILDING : MAIN_IP +  "/kaist/building",
    CCTV :
        {
            LIST : MAIN_IP +  "/kaist/cctv",
            REGI : MAIN_IP + "/kaist/cctv",
            EDIT : MAIN_IP +  "/kaist/cctv",
            DEL : MAIN_IP +  "/kaist/cctv/{streamId}"
        },
    EVENT : {
        MAIN : MAIN_IP +  "/kaist/event",
        LAST : MAIN_IP +  "/kaist/event/last",
        BUILDING : MAIN_IP + "/kaist/event/{buildId}",
        CLEAR : MAIN_IP +  "/kaist/event/clear/{seqn}"
    },
    PATROL : {
        LIST : MAIN_IP +  "/kaist/patrol",
        REGI : MAIN_IP +  "/kaist/patrol",
        DELETE : MAIN_IP +  "/kaist/patrol/{id}",
        EDIT : MAIN_IP +  "/kaist/patrol"
    }
}