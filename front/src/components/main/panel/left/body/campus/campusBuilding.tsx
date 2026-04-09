import {useCommonStore} from "../../../../../../api/data/common.ts";
import {useFacStore} from "../../../../../../api/data/fac.ts";
import CampusBuildingBtn from "./campusBuildingBtn.tsx";
import {useState} from "react";

const CampusBuilding = () => {

    const campusAreas = useCommonStore().campusType;
    const buildings = useFacStore().buildings;

    const [activeArea, setActiveArea] = useState<string>('whole');

    return(
        <>
            <div className="sub-tab__wrap">
                <button key={`left_tab_whole`} type="button" className={`sub-tab ${activeArea === 'whole' ? 'active' : ''}`} onClick={()=>setActiveArea('whole')}>전체</button>
                {
                    campusAreas.map((area)=>(
                        <button key={`left_tab_${area.code}`} type="button"
                                className={`sub-tab  ${area.code === activeArea ? 'active' : ''}`}
                                onClick={()=>setActiveArea(area.code)}
                        >{area.name}</button>
                    ))
                }
            </div>
            <div className={"list__container"}>
                <p className="info">건물 클릭 시 투망 기능이 자동 활성화됩니다.</p>
                <div className={`list list--facility`}>
                    <div className="list__head">
                        <h3 className="list__title">건물 리스트<span>{buildings ? buildings.totalCnt : 0}</span></h3>
                        <div className="list__map">지도 표출
                            <button type="button" className={`btn-map active`}></button>
                        </div>
                    </div>
                    <div className={`list__body`}>
                        <ul className="ct-scroll">
                            {
                                buildings&&
                                buildings.totalCnt > 0 &&
                                buildings.buildingItems.filter((building)=>activeArea === "whole" || building.area === activeArea).map((building)=>(
                                    <CampusBuildingBtn building={building}/>
                                ))
                            }
                        </ul>
                    </div>
                </div>
            </div>
        </>


    )

}

export default CampusBuilding