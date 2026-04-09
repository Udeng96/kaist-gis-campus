import { useEffect, useRef, useState } from 'react';
import { usePatrolStore } from '@store/patrolStore';

const DURATION_OPTIONS = [
    { label: '00:10', second: 10 },
    { label: '00:20', second: 20 },
    { label: '00:30', second: 30 },
    { label: '00:40', second: 40 },
    { label: '00:50', second: 50 },
    { label: '01:00', second: 60 },
];

const PatrolPlayer = () => {
    const activePatrol = usePatrolStore((s) => s.activePatrol);
    const currentCctvIndex = usePatrolStore((s) => s.currentCctvIndex);
    const playDuration = usePatrolStore((s) => s.playDuration);
    const playElapsed = usePatrolStore((s) => s.playElapsed);
    const isPlaying = usePatrolStore((s) => s.isPlaying);
    const stopPatrol = usePatrolStore((s) => s.actions.stopPatrol);
    const nextCctv = usePatrolStore((s) => s.actions.nextCctv);
    const prevCctv = usePatrolStore((s) => s.actions.prevCctv);
    const setPlayDuration = usePatrolStore((s) => s.actions.setPlayDuration);
    const setPlayElapsed = usePatrolStore((s) => s.actions.setPlayElapsed);

    const [isTimeOpen, setIsTimeOpen] = useState(false);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        if (!isPlaying) return;
        timerRef.current = setInterval(() => {
            const { playElapsed: elapsed, playDuration: duration } = usePatrolStore.getState();
            if (elapsed + 1 >= duration) {
                usePatrolStore.getState().actions.nextCctv();
            } else {
                setPlayElapsed(elapsed + 1);
            }
        }, 1000);
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [isPlaying, currentCctvIndex]);

    if (!activePatrol || !activePatrol.cctvMapps?.length) return null;

    const currentCctv = activePatrol.cctvMapps[currentCctvIndex];
    const progressPercent = Math.min(100, Math.round((playElapsed / playDuration) * 100));
    const currentDurationLabel = DURATION_OPTIONS.find(d => d.second === playDuration)?.label ?? '00:30';

    const handleTimeSelect = (sec: number) => {
        setPlayDuration(sec);
        setPlayElapsed(0);
        setIsTimeOpen(false);
    };

    return (
        <div className="cctv__layer cctv__layer--patrol cctv__layer--in"
             style={{ position: 'absolute', top: 89, right: 70, zIndex: 99999, pointerEvents: 'auto' }}>
            {/* 헤더: 번호 + CCTV명 + X */}
            <div className="cctv__layer__head">
                <div className="frame">
                    <div className="num">{currentCctvIndex + 1}</div>
                    <p>{currentCctv?.cctvInfo?.facInfo?.facName ?? '-'}</p>
                </div>
                <button type="button" className="btn-close" onClick={stopPatrol} />
            </div>

            {/* 영상 영역 (placeholder) */}
            <div className="cctv__layer__body">
                <div className="cctv__in" style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: '#111', minHeight: 220
                }}>
                    <div style={{ color: '#555', textAlign: 'center' }}>
                        <p style={{ fontSize: 40, marginBottom: 4 }}>📹</p>
                        <p style={{ fontSize: 12 }}>{currentCctv?.cctvInfo?.facInfo?.facName ?? ''}</p>
                        <p style={{ fontSize: 11, color: '#444', marginTop: 2 }}>{currentCctv?.cctvInfo?.building ?? ''}</p>
                    </div>
                </div>
                <button type="button" className="btn-expand" />
            </div>

            {/* 프로그레스 바 */}
            <div className="bar-wrap">
                <div className="bar" style={{ width: `${progressPercent}%` }} />
            </div>

            {/* 푸터: ◀▶ + 전환 시간 */}
            <div className="cctv__layer__footer">
                <div className="frame">
                    <button type="button" className="btc-prev" onClick={prevCctv} />
                    <button type="button" className="btc-next" onClick={nextCctv} />
                </div>
                <div className="frame">
                    전환 시간
                    <div className={`select-box ${isTimeOpen ? 'active' : ''}`}>
                        <button className="btn--select" onClick={() => setIsTimeOpen(!isTimeOpen)}>
                            {currentDurationLabel}
                        </button>
                        <div className="drop-down">
                            <ul>
                                {DURATION_OPTIONS.map((opt) => (
                                    <li key={opt.second}
                                        className={`select__item ${playDuration === opt.second ? 'selected' : ''}`}>
                                        <button onClick={() => handleTimeSelect(opt.second)}>
                                            {opt.label}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatrolPlayer;
