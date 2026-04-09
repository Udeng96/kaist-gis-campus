import moment from "moment/moment";

export const isDev = process.env.NODE_ENV === "development";

export const TOAST_TYPE = {
    ERROR : 'error',
    WARNING : 'warning',
    SUCCESS : 'success'
}

export const MODAL_NONE = {cd:"NONE", nm:"없음"};
export const MODAL_LAST_EVENT = {cd:"LAST_EVENT", nm:"지난 이벤트"};
export const MODAL_ON_BOARD = {cd:"ON_BOARD", nm:"온보딩"};

export const LEFT_MOD_TAB = {cd:"TAB", nm:"탭"}
export const LEFT_MOD_PATROL = {cd:"PATROL", nm:"순찰"}
export const LEFT_MOD_PATROL_REGI = {cd:"PATROL_REGI", nm:"순찰 등록"}
export const LEFT_MOD_PATROL_EDIT = {cd:"PATROL_EDIT", nm:"순찰 수정"}

export const LEFT_MENU_CAMPUS = {cd : "CAMPUS", nm: "캠퍼스 구역"};
export const LEFT_MENU_EVENT = {cd: "EVENT", nm : "이벤트"};
export const LEFT_MENU_FAVORITE = {cd: "FAVORITE", nm : "즐겨찾기"};

export const RIGHT_MOD_NONE = {cd:"NONE", nm:"없음"};
export const RIGHT_MOD_TAB = {cd:"TAB", nm:"탭"};
export const RIGHT_MOD_CCTV_REGI = {cd:"CCTV_REGI", nm:"CCTV 등록"};
export const RIGHT_MOD_CCTV_EDIT = {cd:"CCTV_EDIT", nm:"CCTV 편집"};
export const RIGHT_MOD_EVENT_CCTV = {cd:"EVENT_CCTV", nm:"주변 CCTV"};
export const RIGHT_MOD_EVENT_REGI = {cd:"EVENT_EDIT", nm:"수동 이벤트 등록"};

export const RIGHT_MENU_CCTV = {cd : "cctv", nm:"CCTV"};
export const RIGHT_MENU_EVENT = {cd : "event", nm:"이벤트"};

export const CCTV_STATE_PLAY = "P";
export const CCTV_STATE_LOAD = "L";
export const CCTV_STATE_NO = "N";


export const LEFT_CAMPUS_WHOLE = {cd : "WHOLE", nm:"전체"};
export const LEFT_CAMPUS_N = {cd : "N", nm:"N구역"};
export const LEFT_CAMPUS_W = {cd : "W", nm:"W구역"};
export const LEFT_CAMPUS_E = {cd : "E", nm:"E구역"};

export const CAMPUS_TYPE_FAC = {cd: "facility", nm:"건물"};
export const CAMPUS_TYPE_CCTV = {cd: "cctv", nm:"CCTV"};

export const CCTV_TYPE_WHOLE= {id : '0' ,cd : "whole", nm: "전체"};
export const CCTV_TYPE_IN = {id : '1', cd : "in", nm: "내부"};
export const CCTV_TYPE_OUT = {id : '2' ,cd : "out", nm: "외부"};
export const CCTV_TYPE_FLAME = {id : '3' ,cd : "flame", nm: "불꽃"};

export const EVENT_TYPE_WHOLE = {cd : "whole", nm:"전체"};
export const EVENT_TYPE_GAS = { cd : "gas", nm:"가스"};
export const EVENT_TYPE_FIRE = {cd : "fire", nm:"화재"};
export const EVENT_TYPE_FLAME = {cd : "flame", nm:"불꽃"};

export const PATROL_SORT_RECENT = {cd : "recent", nm:"최근 등록순"}
export const PATROL_SORT_ABC = {cd : "abc", nm:"가나다순"}

export const DTM_DATE = {cd : 'oneDate', nm:'지난 24시간',start : moment().subtract(1,'days').format('YYYYMMDD'), end: moment().format('YYYYMMDD')}
export const DTM_ONE_WEEK = {cd : 'oneWeek', nm:'1주일',start : moment().subtract(1,'weeks').format('YYYYMMDD'), end: moment().format('YYYYMMDD')}
export const DTM_ONE_MONTH = {cd : 'oneMonth', nm:'1개월',start : moment().subtract(1,'months').format('YYYYMMDD'), end: moment().format('YYYYMMDD')}
export const DTM_THREE_MONTH = {cd : 'threeMonth',nm:'3개월',start : moment().subtract(3,'months').format('YYYYMMDD'), end: moment().format('YYYYMMDD')}
export const DTM_SIX_MONTH = {cd : 'sixMonth', nm:'6개월',start : moment().subtract(6,'months').format('YYYYMMDD'), end: moment().format('YYYYMMDD')}

export const PATROL_TIME_TEN_SECONDS = {cd: 'TEN_SECONDS', second: 10, nm: '00:10'};
export const PATROL_TIME_TWENTY_SECONDS = {cd: 'TWENTY_SECONDS', second: 20, nm: '00:20'};
export const PATROL_TIME_THIRTY_SECONDS = {cd: 'THIRTY_SECONDS', second: 30, nm: '00:30'};
export const PATROL_TIME_FOURTY_SECONDS = {cd: 'FOURTY_SECONDS', second: 40, nm: '00:40'};
export const PATROL_TIME_FIFTY_SECONDS = {cd: 'FIFTY_SECONDS', second: 50, nm: '00:50'};
export const PATROL_TIME_ONE_MINUTE = {cd : "ONE_MINUTE", second: 60, nm: '01:00'};



export const domain = window.location.host;
