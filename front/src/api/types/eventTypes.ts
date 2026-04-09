export type EventResponse = {
    totalCnt : number;
    totalPage : number;
    cnt : number;
    page : number;
    events : EventType[];

}

export type EventType = {
    seqn : string;
    type : string;
    level : string;
    mappBuild : string;
    outbDtm : string;
    clrDtm : string;
}