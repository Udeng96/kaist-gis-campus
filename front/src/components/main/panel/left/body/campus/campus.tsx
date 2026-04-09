import CampusBuilding from "./campusBuilding.tsx";
import CampusCctv from "./campusCctv.tsx";

const Campus = () => {
    return(
        <li className={`tab__item tab__item--campus active`}>
            <CampusBuilding/>
            <CampusCctv/>
        </li>
    )
}

export default Campus