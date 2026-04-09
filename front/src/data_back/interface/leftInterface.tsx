export interface BUILDING_TYPE {
    id : string,
    name : string,
    area : string,
    note : string,
    favoriteYn : string, // 0 : false, 1: true,
    xcrdnt: string,
    ycrdnt: string
}

export interface CCTV_TYPE{
    streamId : string,
    cctvNm : string,
    ipAddr : string,
    health : string,
    rtsp01 : string,
    rtsp02 : string,
    id : string,
    pwd : string,
    port : number,
    plcType : string,
    building : string,
    xcrdnt : string,
    ycrdnt : string,
    favoriteYn : string,
}
export interface EVENT_TYPE{
    seqn : string,
    type: string,
    outbDtm : string,
    clrDtm : string,
    mappBuildingId : string,
    mappCctvId : string,
    mappSensorId: string
}

export interface WS_MSG_TYPE{

}

export interface PATROL_TYPE{
    id : string,
    name : string,
    regDtm : string,
    cctvMappId : string
}

export interface TreeNode{
    value: string;
    label: string;
    children: ParentNode[];
}

export interface ParentNode{
    value : string;
    label : string
}



