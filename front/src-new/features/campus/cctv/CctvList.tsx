import { useState, useMemo, useRef, useEffect } from 'react';
import { useFacStore } from '@store/facStore';
import { useCampusStore } from '@store/campusStore';
import { useCommonStore } from '@store/commonStore';
import CctvItem from './CctvItem';
import { CCTV_TYPE_CODE } from '@constants/meta';

const CctvList = () => {
    const scrollRef = useRef<HTMLUListElement>(null);
    const cctvs = useFacStore((s) => s.cctvs);
    const cctvTypes = useCommonStore((s) => s.cctvType);
    const activeBuilding = useCampusStore((s) => s.activeBuilding);
    const highlightCctvs = useCampusStore((s) => s.highlightCctvs);
    const cctvTypeFilter = useCampusStore((s) => s.cctvTypeFilter);
    const setCctvTypeFilter = useCampusStore((s) => s.actions.setCctvTypeFilter);
    const showCctvMarkers = useCampusStore((s) => s.showCctvMarkers);
    const toggleCctvMarkers = useCampusStore((s) => s.actions.toggleCctvMarkers);

    // 건물 활성화 시 CCTV 리스트 스크롤 맨 위로
    useEffect(() => {
        if (activeBuilding && scrollRef.current) {
            scrollRef.current.scrollTop = 0;
        }
    }, [activeBuilding]);

    const filtered = useMemo(() => {
        const list = cctvs?.cctvItems ?? [];
        return cctvTypeFilter === 'whole' ? list : list.filter((c) => c.type === cctvTypeFilter);
    }, [cctvs, cctvTypeFilter]);

    return (
        <div className="list__container">
            <p className="info">CCTV 다중 선택시, 선택 순서대로 번호 마커가 표시됩니다.</p>
            <div className="list list--cctv">
                <div className="list__head">
                    <h3 className="list__title">CCTV 리스트<span>{cctvs?.totalCnt ?? 0}</span></h3>
                    <div className="list__map">지도 표출<button type="button" className={`btn-map ${showCctvMarkers ? '' : 'active'}`} onClick={toggleCctvMarkers} /></div>
                </div>
                <div className="btn-wrap">
                    <button type="button" className={`btn-preset all ${cctvTypeFilter === 'whole' ? 'active' : ''}`} onClick={() => setCctvTypeFilter('whole')}>전체</button>
                    {cctvTypes.map((type, i) => {
                        const typeValue = CCTV_TYPE_CODE[i]?.toUpperCase() ?? type.code;
                        return (
                            <button key={type.code} type="button" className={`btn-preset ${cctvTypeFilter === typeValue ? 'active' : ''}`} onClick={() => setCctvTypeFilter(typeValue)}>
                                {type.name.replace('CCTV', '')}
                            </button>
                        );
                    })}
                </div>
                <div className="list__body">
                    <ul ref={scrollRef} className="ct-scroll">
                        {activeBuilding && highlightCctvs
                            .filter((c) => cctvTypeFilter === 'whole' || c.type === cctvTypeFilter)
                            .map((cctv, idx) => (
                                <CctvItem key={`hl_${cctv.facInfo.facId}`} cctv={cctv} idx={idx} />
                            ))}
                        {filtered.map((cctv) => (
                            <CctvItem key={cctv.facInfo.facId} cctv={cctv} idx={-1} />
                        ))}
                    </ul>
                </div>
                <div className="list__footer">
                    <button type="button" className="btn btn-normal btn-ic plus" onClick={() => useCampusStore.getState().actions.openCctvCreate()}>CCTV 등록</button>
                </div>
            </div>
        </div>
    );
};

export default CctvList;
