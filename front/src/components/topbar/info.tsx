import {useQuery} from "@tanstack/react-query";
import {getHttp} from "../../api/commonApi.ts";
import type {WeatherType} from "../../api/types/commonTypes.ts";
import {useEffect, useState} from "react";
import moment from "moment/moment";
import {BASE_URL, END_POINT} from "../../config/url.ts";

const Info = () => {

    const [date, setDate] = useState<string>(moment().format("YYYY년 MM월 DD일 HH:mm"));

    const {data: weather} = useQuery({
        queryKey: ["weather"],
        queryFn: () => getHttp<WeatherType>(BASE_URL + END_POINT.COMMON.WEATHER, {}),
        staleTime : 1000 * 60 * 10
    })


    useEffect(() => {
        const interval = setInterval(() => {
            setDate(moment().format("YYYY년 MM월 DD일 HH:mm"));
        }, 1000);

        return () => clearInterval(interval); // 언마운트 시 정리
    }, []);

    return (
        <>
            <div className="frame">
                <div className="date"><p>{date}</p></div>
                <div className="weather">
                    <div className={`weather__icon ${weather ? weather.skyIcon : 'sun'}`}></div>
                    <p className="weather__text">{weather ? weather.skyNm : '맑음'}</p>
                    <p className="temp__value">{weather ? weather.temp : '0'}<span>℃</span></p>
                </div>
                <div className="dust">
                    <div className={`dust__view dust__view--${weather ? weather.dustIcon : "normal"}`}>
                        <p>미세먼지</p>
                    </div>
                    <div className={`dust__view dust__view--${weather ? weather.ultraDustIcon : 'normal'}>
                }`}>
                        <p>초미세먼지</p>
                    </div>
                </div>
            </div>
            <div className="marquee">
                <p>{weather ? weather.report : '특보 없음'}</p>
            </div>
        </>
    )

}

export default Info