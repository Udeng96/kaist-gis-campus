import { useMemo } from 'react';
import { useCommonClientStore } from '@store/appStore';
import { useCampusStore } from '@store/campusStore';
import { useEventStore } from '@store/eventStore';
import CampusRight from '@features/campus/detail/CampusRight';
import CctvForm from '@features/campus/cctv/form/CctvForm';
import EventRight from '@features/event/EventRight';
import PassiveEventForm from '@features/event/form/PassiveEventForm';

const RightPanel = () => {
    const activeLeftMenu = useCommonClientStore((s) => s.activeLeftMenu);
    const activeBuilding = useCampusStore((s) => s.activeBuilding);
    const cctvFormMode = useCampusStore((s) => s.cctvFormMode);
    const activeEvent = useEventStore((s) => s.activeEvent);
    const passiveFormOpen = useEventStore((s) => s.passiveFormOpen);
    const setPassiveFormOpen = useEventStore((s) => s.actions.setPassiveFormOpen);

    const isVisible = useMemo(
        () =>
            (activeLeftMenu === 'CAMPUS' && activeBuilding !== null) ||
            cctvFormMode !== 'NONE' ||
            (activeLeftMenu === 'EVENT' && (activeEvent !== null || passiveFormOpen)),
        [activeLeftMenu, activeBuilding, cctvFormMode, activeEvent, passiveFormOpen]
    );

    return (
        <section
            className={`content content--right ${isVisible ? 'active' : ''}`}
            style={(cctvFormMode !== 'NONE' || passiveFormOpen) ? { zIndex: 6 } : undefined}
        >
            <div className="dimmed" />
            {cctvFormMode !== 'NONE' && <CctvForm />}
            {cctvFormMode === 'NONE' && activeLeftMenu === 'CAMPUS' && <CampusRight />}
            {cctvFormMode === 'NONE' && activeLeftMenu === 'EVENT' && !passiveFormOpen && activeEvent && <EventRight />}
            {cctvFormMode === 'NONE' && activeLeftMenu === 'EVENT' && passiveFormOpen && (
                <PassiveEventForm onClose={() => setPassiveFormOpen(false)} />
            )}
        </section>
    );
};

export default RightPanel;
