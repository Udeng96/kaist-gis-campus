import { useEffect, useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';
import type { CctvType } from '@api/types/fac';
import { useCampusStore } from '@store/campusStore';
import { useFavoriteStore } from '@store/favoriteStore';
import { useFacStore } from '@store/facStore';
import { useCommonStore } from '@store/commonStore';
import { useCommonClientStore } from '@store/appStore';
import { CCTV_TYPE_CODE } from '@constants/meta';

interface Props {
    cctv: CctvType;
    idx: number;
}

const CctvItem = ({ cctv, idx }: Props) => {
    const ref = useRef<HTMLLIElement>(null);
    const cctvTypes = useCommonStore((s) => s.cctvType);
    const activeLeftMenu = useCommonClientStore((s) => s.activeLeftMenu);
    const isFavoriteTab = activeLeftMenu === 'FAVORITE';

    const campusState = useCampusStore(
        useShallow((s) => ({
            activeBuilding: s.activeBuilding,
            selectedCctvs: s.selectedCctvs,
            toggleSelectedCctv: s.actions.toggleSelectedCctv,
            scrollTargetId: s.scrollTargetId,
            setScrollTargetId: s.actions.setScrollTargetId,
        }))
    );
    const favorState = useFavoriteStore(
        useShallow((s) => ({
            activeBuilding: s.activeBuilding,
            selectedCctvs: s.selectedCctvs,
            toggleSelectedCctv: s.actions.toggleSelectedCctv,
        }))
    );

    const activeBuilding = isFavoriteTab ? favorState.activeBuilding : campusState.activeBuilding;
    const selectedCctvs = isFavoriteTab ? favorState.selectedCctvs : campusState.selectedCctvs;
    const toggleSelectedCctv = isFavoriteTab ? favorState.toggleSelectedCctv : campusState.toggleSelectedCctv;
    const scrollTargetId = campusState.scrollTargetId;
    const setScrollTargetId = campusState.setScrollTargetId;

    const myId = `cctv-${cctv.facInfo.facId}`;

    useEffect(() => {
        if (scrollTargetId === myId && ref.current) {
            ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setScrollTargetId(null);
        }
    }, [scrollTargetId]);

    const typeIdx = CCTV_TYPE_CODE.findIndex((c) => c.toUpperCase() === cctv.type);
    const typeClass = typeIdx >= 0 ? CCTV_TYPE_CODE[typeIdx] : '';
    const typeLabel = typeIdx >= 0 && cctvTypes[typeIdx]
        ? cctvTypes[typeIdx].name.replace('CCTV', '')
        : cctv.type ?? '';

    const isHighlight = idx !== -1;
    const selectedIdx = selectedCctvs.findIndex((c) => c.facInfo.facId === cctv.facInfo.facId);
    const isSelected = selectedIdx !== -1;

    const handleClick = () => {
        if (activeBuilding) return;
        toggleSelectedCctv(cctv);
    };

    return (
        <li
            ref={ref}
            className={`list__item ${typeClass} ${isHighlight ? 'highlight' : ''} ${isSelected ? 'active' : ''}`}
            onClick={handleClick}
        >
            <div>
                <i className="ic-mark">
                    {isHighlight ? idx + 1 : isSelected ? selectedIdx + 1 : ''}
                </i>
                {typeLabel}
            </div>
            <div>{cctv.facInfo.facName}</div>
            <div className="frame">
                <button type="button" className="btc-edit" style={isFavoriteTab ? { visibility: 'hidden' } : undefined} onClick={(e) => { e.stopPropagation(); if (!isFavoriteTab) useCampusStore.getState().actions.openCctvEdit(cctv); }} />
                <button type="button" className={`btn-favorites ${cctv.facInfo.isFavorite ? 'active' : ''}`}
                    onClick={(e) => { e.stopPropagation(); useFacStore.getState().actions.toggleCctvFavorite(cctv.facInfo.facId); }} />
            </div>
        </li>
    );
};

export default CctvItem;
