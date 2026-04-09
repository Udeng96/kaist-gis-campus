import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useCampusStore } from '@store/campusStore';
import CctvTab from './CctvTab';
import EventTab from './EventTab';

const CampusRight = () => {
    const { activeBuilding, rightTab, setRightTab } = useCampusStore(
        useShallow((s) => ({
            activeBuilding: s.activeBuilding,
            rightTab: s.rightTab,
            setRightTab: s.actions.setRightTab,
        }))
    );

    useEffect(() => { setRightTab('CCTV'); }, [activeBuilding]);

    if (!activeBuilding) return null;

    return (
        <div className="content__frame content__frame--details facility active">
            <div className="tab">
                <div className="content__head">
                    <div className="frame">
                        <h2 className="content__title content__title--building">
                            {activeBuilding.facInfo.facName} 상세보기
                        </h2>
                        {rightTab === 'CCTV' && <button type="button" className="btn-refresh">새로고침<i /></button>}
                    </div>
                    <div className="btn-tab__wrap">
                        <button type="button" className={`btn-tab ${rightTab === 'CCTV' ? 'active' : ''}`} onClick={() => setRightTab('CCTV')}>CCTV</button>
                        <button type="button" className={`btn-tab ${rightTab === 'EVENT' ? 'active' : ''}`} onClick={() => setRightTab('EVENT')}>이벤트 내역</button>
                    </div>
                </div>
                <div className="content__body">
                    <ul>
                        {rightTab === 'CCTV' && <CctvTab />}
                        {rightTab === 'EVENT' && <EventTab />}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default CampusRight;
