import CampusHead from "./campusHead.tsx";
import CampusBody from "./campusBody.tsx";

const RightCampus = () => {

    return(
        <div className={`content__frame content__frame--details facility active`}>
            <div className="tab">
                <CampusHead/>
                <CampusBody/>
            </div>
        </div>
    )

}

export default RightCampus