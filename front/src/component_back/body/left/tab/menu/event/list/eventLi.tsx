import EventLiItem from "./eventLiItem.tsx";
import type {EVENT_TYPE} from "../../../../../../../data_back/interface/leftInterface.tsx";
import EventNoData from "../../../../../right/body/common/event/eventNoData.tsx";

const EventLi = (props: { eventList: EVENT_TYPE[] }) => {

    const setLevel = (event : EVENT_TYPE) =>{
        if(event.type.includes("gas")){
            const level = Number(event.type.replace("gas", ""));
            return level === 3? '1단계' : level.toString()+"단계";
        }else{
            return '-'
        }
    }

    const setType = (type: string) => {
        if(type.includes("03")){
            return 'gas01';
        }else{
            return type;
        }
    }
    return (
        <div className="list__container">
            <div className="list list--event">
                <div className="list__head">
                    <p>유형</p>
                    <p>단계</p>
                    <p>건물명</p>
                    <p>발생 일시</p>
                    <p>종료 일시</p>
                </div>

                {
                    <div className="list__body">
                        {
                            props.eventList.length > 0 &&
                            <ul className="ct-scroll">
                                {
                                    props.eventList.map((event) => (

                                        <EventLiItem key={`EVENT_iTEM_${event.seqn}`}
                                                     event={event}
                                                     eventId={event.seqn}
                                                     type={setType(event.type)}
                                                     level={setLevel(event)}
                                                     building={event.mappBuildingId} outbDtm={event.outbDtm}
                                                     endDtm={event.clrDtm}/>

                                    ))
                                }
                            </ul>

                        }
                        {
                            props.eventList.length === 0 &&
                            <EventNoData/>
                        }
                    </div>

                }


            </div>
        </div>
    )
}

export default EventLi