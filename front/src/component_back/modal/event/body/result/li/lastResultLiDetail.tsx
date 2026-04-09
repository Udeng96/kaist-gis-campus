import {useLeftStore} from "../../../../../../store_back/zustand/left.ts";
import {EVENT_TYPE_FIRE, EVENT_TYPE_FLAME, EVENT_TYPE_GAS} from "../../../../../../data_back/const/common.ts";
import moment from "moment";

const LastResultLiDetail = () => {

    const activeLastEvent = useLeftStore((state)=> state.activeLastEvent);

    const setEventNm = (eventType: string) => {
        if (eventType.includes(EVENT_TYPE_GAS.cd)) {
            return EVENT_TYPE_GAS.nm
        } else if (eventType.includes(EVENT_TYPE_FIRE.cd)) {
            return EVENT_TYPE_FIRE.nm
        } else if (eventType.includes(EVENT_TYPE_FLAME.cd)) {
            return EVENT_TYPE_FLAME.nm
        }
    }

    const setEventLevel = (eventType: string) => {
        if (eventType.includes(EVENT_TYPE_GAS.cd)) {
            return Number(eventType.replace("gas", "")) + "단계";
        } else if (eventType.includes(EVENT_TYPE_FIRE.cd)) {
            return "-"
        } else if (eventType.includes(EVENT_TYPE_FLAME.cd)) {
            return "-"
        }
    }

    const setType = (type: string) => {
        if(type.includes("03")){
            return 'gas01';
        }else{
            return type;
        }
    }
    return(
        <div className="hist__frame details">
            <div className="details__head">이벤트 상세 정보</div>
            <div className="details__body">
                <div className="frame-wrap">
                    <div className="frame">
                        <p className="label">그룹명</p>
                        <div className="value">
                            <input type="text" value={activeLastEvent ? setEventNm(setType(activeLastEvent.type)) : '-'} disabled/>
                        </div>
                    </div>
                    <div className="frame">
                        <p className="label">단계</p>
                        <div className="value">
                            <input type="text" value={activeLastEvent ? setEventLevel(setType(activeLastEvent.type)) : '-'} disabled/>
                        </div>
                    </div>
                </div>

                <div className="frame">
                    <p className="label">건물명</p>
                    <div className="value">
                        <input type="text" value={activeLastEvent ? activeLastEvent.mappBuildingId : ''} disabled/>
                    </div>
                </div>

                <div className="frame">
                    <p className="label">발생 일시</p>
                    <div className="value">
                        <input type="text" value={activeLastEvent ? moment(activeLastEvent.outbDtm,'YYYYMMDDHHmmss').format("YY-MM-DD HH:mm:ss") : ''}  disabled/>
                    </div>
                </div>

                <div className="frame">
                    <p className="label">종료 일시</p>
                    <div className="value">
                        <input type="text" value={activeLastEvent ? activeLastEvent.clrDtm ?  moment(activeLastEvent.clrDtm,'YYYYMMDDHHmmss').format("YY-MM-DD HH:mm:ss") : '' : ''} disabled/>
                    </div>
                </div>

            </div>
        </div>
    )

}
export default  LastResultLiDetail