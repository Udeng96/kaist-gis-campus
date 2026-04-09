import { useMemo } from 'react';
import { useFacStore } from '@store/facStore';
import { useCommonStore } from '@store/commonStore';
import { useCampusStore } from '@store/campusStore';
import BuildingItem from './BuildingItem';

const BuildingList = () => {
    const buildings = useFacStore((s) => s.buildings);
    const campusAreas = useCommonStore((s) => s.campusType);
    const buildingAreaFilter = useCampusStore((s) => s.buildingAreaFilter);
    const setBuildingAreaFilter = useCampusStore((s) => s.actions.setBuildingAreaFilter);
    const showBuildingMarkers = useCampusStore((s) => s.showBuildingMarkers);
    const toggleBuildingMarkers = useCampusStore((s) => s.actions.toggleBuildingMarkers);

    const filtered = useMemo(() => {
        if (!buildings) return [];
        return buildingAreaFilter === 'whole'
            ? buildings.buildingItems
            : buildings.buildingItems.filter((b) => b.area === buildingAreaFilter);
    }, [buildings, buildingAreaFilter]);

    return (
        <>
            <div className="sub-tab__wrap">
                <button
                    type="button"
                    className={`sub-tab ${buildingAreaFilter === 'whole' ? 'active' : ''}`}
                    onClick={() => setBuildingAreaFilter('whole')}
                >
                    전체
                </button>
                {campusAreas.map((area) => (
                    <button
                        key={area.code}
                        type="button"
                        className={`sub-tab ${buildingAreaFilter === area.code ? 'active' : ''}`}
                        onClick={() => setBuildingAreaFilter(area.code)}
                    >
                        {area.name}
                    </button>
                ))}
            </div>
            <div className="list__container">
                <p className="info">건물 클릭 시 투망 기능이 자동 활성화됩니다.</p>
                <div className="list list--facility">
                    <div className="list__head">
                        <h3 className="list__title">건물 리스트<span>{filtered.length}</span></h3>
                        <div className="list__map">지도 표출<button type="button" className={`btn-map ${showBuildingMarkers ? '' : 'active'}`} onClick={toggleBuildingMarkers} /></div>
                    </div>
                    <div className="list__body">
                        <ul className="ct-scroll">
                            {filtered.map((building) => (
                                <BuildingItem key={building.facInfo.facId} building={building} />
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BuildingList;
