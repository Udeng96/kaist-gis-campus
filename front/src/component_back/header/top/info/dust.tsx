import {useMainStore} from "../../../../store_back/zustand/main.ts";

const Dust = () =>{

    const weather = useMainStore((state)=> state.weather);

    const setCd = (dust : string) => {
        if(dust === "좋음") return "good";
        if(dust === "보통") return "normal";
        if(dust === "나쁨") return "bad";
        if(dust === "매우나쁨") return "vbad";
        return "normal";
    }
    return(
        <div className="dust">
            <div className={`dust__view dust__view--${setCd(weather ? weather.dust : "보통")}`}>
                <p>미세먼지</p>
            </div>
            <div className={`dust__view dust__view--${setCd(weather ? weather.ultraDust : "보통")}`}>
                <p>초미세먼지</p>
            </div>
        </div>
    )

}

export default Dust