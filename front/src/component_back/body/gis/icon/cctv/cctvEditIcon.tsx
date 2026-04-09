import EDIT_TOOLTIP_IMG from "../../../../../assets/image/img/img_gis_tootip02_138x42.png";

const CctvEditIcon = () => {

    return (
        <button className="gis__icon-wrap " style={{top: "291px", left: "642px", zIndex: "1003"}}>
            <i className="gis__icon modify"></i>
            <div className="marker-tooltip">
                <img src={EDIT_TOOLTIP_IMG}/>
            </div>
        </button>
    )
}

export default CctvEditIcon