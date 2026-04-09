export const isDev = process.env.NODE_ENV === "development";

export const BASE_URL = isDev ? "http://localhost:22410" : "";
export const END_POINT = {
    COMMON: {
        META_DATA : "/kaist/common/types",
        WEATHER : "/kaist/weather"
    },
    FAC : {
        ALL : "/kaist/fac",
        CCTV: "/kaist/fac/cctv/{building}/{page}",
        CCTV_CREATE: "/kaist/fac/cctv",
        CCTV_UPDATE: "/kaist/fac/cctv",  // PUT /kaist/fac/cctv/{streamId}
        CCTV_DELETE: "/kaist/fac/cctv",  // DELETE /kaist/fac/cctv/{streamId}
        FAV_BUILDING: "/kaist/fac/favorite/building",  // PUT /kaist/fac/favorite/building/{code}
        FAV_CCTV: "/kaist/fac/favorite/cctv",  // PUT /kaist/fac/favorite/cctv/{streamId}
    },
    EVENT :  {
        ALL : "/kaist/event",
        BUILDING : "/kaist/event/building",
        CLEAR : "/kaist/event/clear",  // PUT /kaist/event/clear/{id}
        CREATE : "/kaist/event",  // POST /kaist/event/
    },
    PATROL : {
        ALL : "/kaist/patrol",
        CREATE : "/kaist/patrol",
        UPDATE : "/kaist/patrol",  // PUT /kaist/patrol/{id}
        DELETE : "/kaist/patrol",  // DELETE /kaist/patrol/{id}
    }
}