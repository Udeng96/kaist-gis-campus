import noDataImg from "@/assets/image/img/img_no-result-06_100x100.svg"
import type {EventType} from "../../../../../api/types/eventTypes.ts";

const EventTabResult = (props: { events: EventType[] }) => {

    return (
        <div className="list__container">
            <div className="list list--event">
                <div className="list__head">
                    <p>유형</p>
                    <p>단계</p>
                    <p>발생 일시</p>
                    <p>종료 일시</p>
                </div>
                <div className="list__body">
                    {
                        props.events.length > 0 &&
                        <ul className="ct-scroll">
                        </ul>
                    }
                    {
                        props.events.length === 0 &&
                        <div className="error-frame">
                            <img src={noDataImg}/>
                            <p>현재 조건에 해당되는 데이터가 없습니다.</p>
                        </div>
                    }
                </div>
            </div>
        </div>

    )
}

export default EventTabResult