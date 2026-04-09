import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useShallow } from 'zustand/react/shallow';
import { getHttp } from '@api/http';
import { BASE_URL, END_POINT } from '@api/url';
import type { MetaType } from '@api/types/common';
import { useCommonStore } from '@store/commonStore';
import { useCampusStore } from '@store/campusStore';
import { useEventStore } from '@store/eventStore';
import { META_KEY } from '@constants/meta';
import Header from './Header';
import LeftPanel from './LeftPanel';
import GisMap from './GisMap';
import RightPanel from './RightPanel';
import ConfirmModal from '@components/modal/ConfirmModal';

const Root = () => {
    const actions = useCommonStore(useShallow((s) => s.actions));
    const cctvFormMode = useCampusStore((s) => s.cctvFormMode);
    const closeCctvForm = useCampusStore((s) => s.actions.closeCctvForm);
    const passiveFormOpen = useEventStore((s) => s.passiveFormOpen);
    const setPassiveFormOpen = useEventStore((s) => s.actions.setPassiveFormOpen);
    const [showExitConfirm, setShowExitConfirm] = useState(false);

    const { data: metaData } = useQuery({
        queryKey: ['meta'],
        queryFn: () => getHttp<MetaType[]>(BASE_URL + END_POINT.COMMON.META_DATA, {}),
        staleTime: 1000 * 60 * 10,
    });

    useEffect(() => {
        if (!metaData) return;
        actions.setLeftTab(metaData.filter((m) => m.type === META_KEY.LEFT_TAB_TYPE));
        actions.setCctvType(metaData.filter((m) => m.type === META_KEY.CCTV_TYPE));
        actions.setSensorType(metaData.filter((m) => m.type === META_KEY.FAC));
        actions.setCampusType(metaData.filter((m) => m.type === META_KEY.CAMPUS_AREA));
        actions.setEventType(metaData.filter((m) => m.type === META_KEY.EVENT));
    }, [metaData]);

    const isEditing = cctvFormMode !== 'NONE' || passiveFormOpen;

    const handleOverlayClick = () => {
        setShowExitConfirm(true);
    };

    const handleExitConfirm = () => {
        if (cctvFormMode !== 'NONE') closeCctvForm();
        if (passiveFormOpen) setPassiveFormOpen(false);
        setShowExitConfirm(false);
    };

    const exitTitle = cctvFormMode !== 'NONE' ? '편집 종료' : '등록 종료';
    const exitMessage = cctvFormMode !== 'NONE'
        ? 'CCTV 편집모드를 종료하시겠습니까? 저장되지 않은 내용은 사라집니다.'
        : '수동 이벤트 등록을 종료하시겠습니까? 저장되지 않은 내용은 사라집니다.';

    return (
        <div className="wrap">
            <Header />
            <main>
                <GisMap />
                <LeftPanel />
                <div />
                <RightPanel />

                {isEditing && (
                    <div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            zIndex: 5,
                            cursor: 'not-allowed',
                        }}
                        onClick={handleOverlayClick}
                    />
                )}
            </main>

            {showExitConfirm && (
                <ConfirmModal
                    title={exitTitle}
                    message={exitMessage}
                    confirmLabel="나가기"
                    confirmType="negative"
                    onConfirm={handleExitConfirm}
                    onCancel={() => setShowExitConfirm(false)}
                />
            )}
        </div>
    );
};

export default Root;
