export const isDev = process.env.NODE_ENV === "development";

export const BASE_URL = isDev ? "http://localhost:22410" : "";
export const END_POINT = {
    COMMON: {
        META_DATA : "/kaist/common/types",
        WEATHER : "/kaist/weather"
    },
    FAC : {
        ALL : "/kaist/fac",
        CCTV: "/kaist/fac/cctv/{building}/{page}"
    },
    EVENT :  {
        ALL : "/kaist/event",
        BUILDING : "/kaist/event/building"

    }
}