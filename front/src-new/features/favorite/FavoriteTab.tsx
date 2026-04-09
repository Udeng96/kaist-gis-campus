import { useState, useMemo } from 'react';
import { useFacStore } from '@store/facStore';
import { useCommonStore } from '@store/commonStore';
import { useCampusStore } from '@store/campusStore';
import { CCTV_TYPE_CODE } from '@constants/meta';
import BuildingItem from '@features/campus/building/BuildingItem';
import CctvItem from '@features/campus/cctv/CctvItem';
import noDataImg from '@assets/image/img/img_no-result-06_100x100.svg';

const FavoriteTab = () => {
    const buildings = useFacStore((s) => s.buildings);
    const cctvs = useFacStore((s) => s.cctvs);
    const campusAreas = useCommonStore((s) => s.campusType);
    const cctvTypes = useCommonStore((s) => s.cctvType);
    const activeBuilding = useCampusStore((s) => s.activeBuilding);
    const highlightCctvs = useCampusStore((s) => s.highlightCctvs);

    const [buildingArea, setBuildingArea] = useState('whole');
    const [cctvTypeFilter, setCctvTypeFilter] = useState('whole');
    const [showBuildingMarkers, setShowBuildingMarkers] = useState(true);
    const [showCctvMarkers, setShowCctvMarkers] = useState(true);

    // 즐겨찾기 건물만 필터
    const favoriteBuildings = useMemo(() => {
        if (!buildings) return [];
        return buildings.buildingItems
            .filter((b) => b.facInfo.isFavorite)
            .filter((b) => buildingArea === 'whole' || b.area === buildingArea);
    }, [buildings, buildingArea]);

    // 즐겨찾기 CCTV만 필터
    const favoriteCctvs = useMemo(() => {
        if (!cctvs) return [];
        return cctvs.cctvItems
            .filter((c) => c.facInfo.isFavorite)
            .filter((c) => {
                if (cctvTypeFilter === 'whole') return true;
                return c.type === cctvTypeFilter;
            });
    }, [cctvs, cctvTypeFilter]);

    return (
        <li className="tab__item tab__item--favorites active">
            {/* 건물 구역 필터 */}
            <div className="sub-tab__wrap">
                <button type="button" className={`sub-tab ${buildingArea === 'whole' ? 'active' : ''}`}
                    onClick={() => setBuildingArea('whole')}>전체</button>
                {campusAreas.map((area) => (
                    <button key={area.code} type="button"
                        className={`sub-tab ${buildingArea === area.code ? 'active' : ''}`}
                        onClick={() => setBuildingArea(area.code)}>{area.name}</button>
                ))}
            </div>

            {/* 건물 리스트 */}
            <div className="list__container">
                <p className="info">건물 클릭 시 투망 기능이 자동 활성화됩니다.</p>
                <div className="list list--facility">
                    <div className="list__head">
                        <h3 className="list__title">건물 리스트<span>{favoriteBuildings.length}</span></h3>
                        <div className="list__map">지도 표출
                            <button type="button" className={`btn-map ${showBuildingMarkers ? '' : 'active'}`}
                                onClick={() => setShowBuildingMarkers(!showBuildingMarkers)} />
                        </div>
                    </div>
                    <div className="list__body">
                        <ul className="ct-scroll">
                            {favoriteBuildings.map((building) => (
                                <BuildingItem key={building.facInfo.facId} building={building} />
                            ))}
                            {favoriteBuildings.length === 0 && (
                                <div className="error-frame">
                                    <img src={noDataImg} alt="no data" />
                                    <p>즐겨찾기된 건물이 없습니다.</p>
                                </div>
                            )}
                        </ul>
                    </div>
                </div>
            </div>

            {/* CCTV 리스트 */}
            <div className="list__container">
                <p className="info">CCTV 다중 선택시, 선택 순서대로 번호 마커가 표시됩니다.</p>
                <div className="list list--cctv">
                    <div className="list__head">
                        <h3 className="list__title">CCTV 리스트<span>{favoriteCctvs.length}</span></h3>
                        <div className="list__map">지도 표출
                            <button type="button" className={`btn-map ${showCctvMarkers ? '' : 'active'}`}
                                onClick={() => setShowCctvMarkers(!showCctvMarkers)} />
                        </div>
                    </div>
                    <div className="btn-wrap">
                        <button type="button" className={`btn-preset all ${cctvTypeFilter === 'whole' ? 'active' : ''}`}
                            onClick={() => setCctvTypeFilter('whole')}>전체</button>
                        {cctvTypes.map((type, i) => {
                            const typeValue = CCTV_TYPE_CODE[i]?.toUpperCase() ?? type.code;
                            return (
                                <button key={type.code} type="button"
                                    className={`btn-preset ${cctvTypeFilter === typeValue ? 'active' : ''}`}
                                    onClick={() => setCctvTypeFilter(typeValue)}>
                                    {type.name.replace('CCTV', '')}
                                </button>
                            );
                        })}
                    </div>
                    <div className="list__body">
                        <ul className="ct-scroll">
                            {activeBuilding && highlightCctvs
                                .filter((c) => c.facInfo.isFavorite)
                                .filter((c) => cctvTypeFilter === 'whole' || c.type === cctvTypeFilter)
                                .map((cctv, idx) => (
                                    <CctvItem key={`hl_${cctv.facInfo.facId}`} cctv={cctv} idx={idx} />
                                ))}
                            {favoriteCctvs.map((cctv) => (
                                <CctvItem key={cctv.facInfo.facId} cctv={cctv} idx={-1} />
                            ))}
                            {favoriteCctvs.length === 0 && !activeBuilding && (
                                <div className="error-frame">
                                    <img src={noDataImg} alt="no data" />
                                    <p>즐겨찾기된 CCTV가 없습니다.</p>
                                </div>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </li>
    );
};

export default FavoriteTab;
