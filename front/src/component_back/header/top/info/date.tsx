import {useEffect, useState} from "react";
import moment from "moment/moment";

const Date = () => {

    const [date, setDate] = useState<string>(moment().format("YYYY년 MM월 DD일 HH:mm"));

    useEffect(() => {
        const interval = setInterval(() => {
            setDate(moment().format("YYYY년 MM월 DD일 HH:mm"));
        }, 1000);

        return () => clearInterval(interval); // 언마운트 시 정리
    },[]);
    return(
        <div className="date">
            <p>{date}</p>
        </div>
    )
}

export default Date