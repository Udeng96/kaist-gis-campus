import noDataImg from "@/assets/image/img/img_no-result-06_100x100.svg"

const EventNoData = () => {

    return(
        <div className="error-frame">
            <img src={noDataImg}/>
            <p>현재 조건에 해당되는 데이터가 없습니다.</p>
        </div>

    )

}

export default EventNoData