const EventCntBox = (props:{eventNm :string,eventType: string, cnt : number}) => {

    return(
        <li className="event__item">
            <p className={`name ${ props.eventType}`}>{props.eventNm}</p>
            <p className="value">{props.cnt}</p>
        </li>
    )

}

export default EventCntBox