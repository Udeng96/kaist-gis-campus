import type {BUILDING_TYPE} from "../../../../../../../data_back/interface/leftInterface.tsx";
import BuildingItem from "./buildingItem.tsx";

const Building = (props:{buildings:BUILDING_TYPE[]}) => {

    return(
        <div className="list__body">
            <ul className="ct-scroll">
                {
                    props.buildings.map((building)=>(
                        <BuildingItem building={building}/>
                    ))
                }
            </ul>
        </div>
    )
}

export default Building