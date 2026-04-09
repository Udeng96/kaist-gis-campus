import {useMainStore} from "../../../../store_back/zustand/main.ts";

const Weather = () => {

    const weather = useMainStore((state)=> state.weather);


    return(
        <div className="weather">
            <div className={`weather__icon ${weather ? weather.ptyCd === 'none' ? weather.skyCd : weather.ptyCd : 'sun'}`}></div>
            <p className="weather__text">{weather ? weather.pty === '없음' ? weather.sky :weather.pty : '맑음' }</p>
            <p className="temp__value">{weather ? weather.temp : '0'}<span>℃</span></p>
        </div>
    )

}

export default Weather