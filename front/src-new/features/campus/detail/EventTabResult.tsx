import type { EventType } from '@api/types/event';
import noDataImg from '@assets/image/img/img_no-result-06_100x100.svg';

interface Props {
    events: EventType[];
}

const EventTabResult = ({ events }: Props) => (
    <div className="list__container">
        <div className="list list--event">
            <div className="list__head">
                <p>유형</p>
                <p>단계</p>
                <p>발생 일시</p>
                <p>종료 일시</p>
            </div>
            <div className="list__body">
                {events.length > 0 ? (
                    <ul className="ct-scroll" />
                ) : (
                    <div className="error-frame">
                        <img src={noDataImg} alt="no data" />
                        <p>현재 조건에 해당되는 데이터가 없습니다.</p>
                    </div>
                )}
            </div>
        </div>
    </div>
);

export default EventTabResult;
