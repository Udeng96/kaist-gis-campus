import { useEffect, useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';
import type { BuildingType } from '@api/types/fac';
import { useCampusStore } from '@store/campusStore';
import { useFavoriteStore } from '@store/favoriteStore';
import { useFacStore } from '@store/facStore';
import { useCommonClientStore } from '@store/appStore';

interface Props {
    building: BuildingType;
}

const BuildingItem = ({ building }: Props) => {
    const ref = useRef<HTMLLIElement>(null);
    const cctvs = useFacStore((s) => s.cctvs);
    const activeLeftMenu = useCommonClientStore((s) => s.activeLeftMenu);
    const isFavoriteTab = activeLeftMenu === 'FAVORITE';

    const campusState = useCampusStore(
        useShallow((s) => ({
            activeBuilding: s.activeBuilding,
            setActiveBuilding: s.actions.setActiveBuilding,
            setHighlightCctvs: s.actions.setHighlightCctvs,
            setSelectedCctvs: s.actions.setSelectedCctvs,
            scrollTargetId: s.scrollTargetId,
            setScrollTargetId: s.actions.setScrollTargetId,
        }))
    );
    const favorState = useFavoriteStore(
        useShallow((s) => ({
            activeBuilding: s.activeBuilding,
            setActiveBuilding: s.actions.setActiveBuilding,
            setHighlightCctvs: s.actions.setHighlightCctvs,
            setSelectedCctvs: s.actions.setSelectedCctvs,
        }))
    );

    const { activeBuilding, setActiveBuilding, setHighlightCctvs, setSelectedCctvs } = isFavoriteTab ? favorState : campusState;
    const scrollTargetId = campusState.scrollTargetId;
    const setScrollTargetId = campusState.setScrollTargetId;

    const isActive = activeBuilding?.facInfo.facId === building.facInfo.facId;
    const myId = `building-${building.facInfo.facId}`;

    useEffect(() => {
        if (scrollTargetId === myId && ref.current) {
            ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setScrollTargetId(null);
        }
    }, [scrollTargetId]);

    const handleClick = () => {
        setSelectedCctvs([]);
        if (isActive) {
            setActiveBuilding(null);
            setHighlightCctvs([]);
        } else {
            setActiveBuilding(building);
            const buildingCctvs = cctvs?.cctvItems.filter(
                (c) => c.building?.split('/').includes(building.facInfo.facId)
            ) ?? [];
            setHighlightCctvs(buildingCctvs);
        }
    };

    return (
        <li ref={ref} className={`list__item ${isActive ? 'active' : ''}`} onClick={handleClick}>
            <div>{building.facInfo.facId}</div>
            <div>{building.facInfo.facName}</div>
            <div className="one_star">
                <button type="button" className={`btn-favorites ${building.facInfo.isFavorite ? 'active' : ''}`}
                    onClick={(e) => { e.stopPropagation(); useFacStore.getState().actions.toggleBuildingFavorite(building.facInfo.facId); }} />
            </div>
        </li>
    );
};

export default BuildingItem;
