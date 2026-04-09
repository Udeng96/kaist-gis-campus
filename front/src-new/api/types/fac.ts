export type FacResponse = {
    cctv : CctvResponse;
    building : BuildingResponse;
}

export type CctvResponse = {
    totalCnt : number;
    totalPage : number;
    cnt : number;
    page : number;
    cctvItems : CctvType[]
}

export type CctvType = {
    facInfo : FacType;
    rtspUrl : string;
    type : string;
    building : string;
}

export type BuildingResponse = {
    totalCnt : number;
    totalPage : number;
    cnt : number;
    page : number;
    buildingItems :  BuildingType[]
}

export type BuildingType = {
    facInfo : FacType;
    area : string;
}

export type FacType = {
    facId : string,
    facName : string,
    xcoord : string,
    ycoord: string,
    isFavorite : boolean,
    facTypeCd : string
}