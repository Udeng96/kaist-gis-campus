

export type ResponseEntity<T> = {
    code: string;      // 또는 number (프로젝트에 맞게)
    message: string;
    data: T;
};

export type MetaType = {
    code: string;
    name: string;
    type: string;
}


export type  WeatherType = {
    skyIcon:string;
    skyNm: string;
    ultraDustIcon : string;
    ultraDustNm : string;
    dustIcon : string;
    dustNm : string;
    temp : string;
    report : string;
}