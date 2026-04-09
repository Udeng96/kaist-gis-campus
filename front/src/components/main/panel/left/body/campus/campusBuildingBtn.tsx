import type {BuildingType} from "../../../../../../api/types/facTypes.ts";
import {useCampusStore} from "../../../../../../data/campus.ts";
import {useShallow} from "zustand/react/shallow";

const CampusBuildingBtn = (props: { building: BuildingType }) => {

    const {activeBuilding, setActiveBuilding} = useCampusStore(useShallow((state)=> ({
        activeBuilding : state.activeBuilding,
        setActiveBuilding : state.actions.setActiveBuilding
    })))

    const handleBuilding = () => {
        if(activeBuilding){
            if(activeBuilding.facInfo.facId === props.building.facInfo.facId){
                setActiveBuilding(null);
            }else{
                setActiveBuilding(props.building);
            }
        }else{
            setActiveBuilding(props.building);
        }
    }

    return (
        <li key={`campus__${props.building.facInfo.facId}`} className={`list__item ${activeBuilding && props.building.facInfo.facId === activeBuilding.facInfo.facId ? 'active' : '' }`} onClick={() => handleBuilding()}>
            <div>{props.building.facInfo.facId}</div>
            <div>{props.building.facInfo.facName}</div>
            <div className={"one_star"}>
                <button type="button"
                        className={`btn-favorites ${props.building.facInfo.isFavorite ? 'active' : ''}`}></button>
            </div>

        </li>
    )

}
export default CampusBuildingBtn