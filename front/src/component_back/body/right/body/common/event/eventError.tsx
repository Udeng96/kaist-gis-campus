const EventError = () => {


    return(
        <div className="error-frame" >
            <p>데이터를 불러올 수 없습니다.<br/>인터넷 연결을 확인 후 다시 시도해 주세요.</p>
            <button type="button" className="btn btn-normal btn-reset">다시보기</button>
        </div>
    )

}
export default EventError