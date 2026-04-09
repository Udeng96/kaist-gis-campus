import type {BUILDING_TYPE} from "../../../../../../../data_back/interface/leftInterface.tsx";
import FavorBuildingItem from "./favorBuildingItem.tsx";

const FavorBuilding = ({buildings}:{buildings:BUILDING_TYPE[]}) => {

    return(
        <div className="list__body">
            <ul className="ct-scroll">
                {
                    buildings.map((building)=>(
                        <FavorBuildingItem building={building}/>
                    ))
                }
            </ul>
        </div>
    )

}

export default FavorBuilding