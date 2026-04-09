const GrpBodyItemCctv = (props:{index:number, cctv:{building_cd:string, type:{cd:string, nm:string}, nm: string}}) => {
    return(
        <div className={`patrol__item__box patrol__item__box--${props.cctv.type.cd}`}>
            <i>{props.index}</i>
            <div className="frame">
                <p>{props.cctv.building_cd.substring(0,1)}구역</p>
                <p>{props.cctv.building_cd}</p>
                <p>{props.cctv.type.nm}</p>
                <p>{props.cctv.nm}</p>
            </div>
        </div>
    )
}
``
export default GrpBodyItemCctv