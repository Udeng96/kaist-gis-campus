import Date from "./info/date.tsx";
import Weather from "./info/weather.tsx";
import Dust from "./info/dust.tsx";

const Top = () =>{

    return(
        <div className="frame">
            <Date/>
            <Weather/>
            <Dust/>
        </div>
    )

}

export default Top