import { useState, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import DatePicker from 'react-datepicker';
import { getHttp, postHttp } from '@api/http';
import { BASE_URL, END_POINT } from '@api/url';
import { useFacStore } from '@store/facStore';
import { useCommonStore } from '@store/commonStore';
import { useEventStore } from '@store/eventStore';

type SensorType = {
    sensorId: string;
    sensorName: string;
    type: string; // GAS, FIRE, FLAME(CCTV)
    building: string; // DB building ID
};

const EVENT_TYPES = [
    { code: 'gas', label: '가스' },
    { code: 'fire', label: '화재' },
    { code: 'flame', label: '불꽃' },
];

const pad = (n: number) => String(n).padStart(2, '0');
const HOURS = Array.from({ length: 24 }, (_, i) => pad(i));
const MINUTES = Array.from({ length: 60 }, (_, i) => pad(i));
const SECONDS = Array.from({ length: 60 }, (_, i) => pad(i));

interface Props {
    onClose: () => void;
}

const PassiveEventForm = ({ onClose }: Props) => {
    const queryClient = useQueryClient();
    const buildings = useFacStore((s) => s.buildings);
    const cctvs = useFacStore((s) => s.cctvs);
    const campusAreas = useCommonStore((s) => s.campusType);

    // 폼 상태
    const [eventType, setEventType] = useState('gas');
    const [level, setLevel] = useState(1);
    const [date, setDate] = useState(new Date());
    const [hour, setHour] = useState(pad(new Date().getHours()));
    const [minute, setMinute] = useState(pad(new Date().getMinutes()));
    const [second, setSecond] = useState(pad(new Date().getSeconds()));
    const [area, setArea] = useState('all');
    const [buildingId, setBuildingId] = useState<string | null>(null);
    const [sensorId, setSensorId] = useState('');

    // 드롭다운
    const [hourOpen, setHourOpen] = useState(false);
    const [minOpen, setMinOpen] = useState(false);
    const [secOpen, setSecOpen] = useState(false);
    const [buildOpen, setBuildOpen] = useState(false);
    const [sensorOpen, setSensorOpen] = useState(false);

    // 센서 목록 조회
    const { data: sensors } = useQuery({
        queryKey: ['sensors'],
        queryFn: () => getHttp<SensorType[]>(BASE_URL + '/kaist/fac/sensors', {}),
        staleTime: Infinity,
    });

    const filteredBuildings = useMemo(() => {
        if (!buildings) return [];
        if (area === 'all') return buildings.buildingItems;
        return buildings.buildingItems.filter((b) => b.area === area);
    }, [buildings, area]);

    const selectedBuilding = buildings?.buildingItems.find((b) => b.facInfo.facId === buildingId);

    // 이벤트 유형에 따른 센서 목록
    const filteredSensors = useMemo((): { sensorId: string; sensorName: string }[] => {
        if (eventType === 'flame') {
            // 불꽃: CCTV 목록에서 FLAME 타입
            if (!cctvs) return [];
            return cctvs.cctvItems
                .filter((c) => c.type === 'FLAME')
                .map((c) => ({ sensorId: c.facInfo.facId, sensorName: c.facInfo.facName }));
        }
        if (!sensors) return [];
        const typeMap: Record<string, string> = { gas: 'GAS', fire: 'FIRE' };
        return sensors
            .filter((s) => s.type === (typeMap[eventType] ?? ''))
            .map((s) => ({ sensorId: s.sensorId, sensorName: s.sensorName }));
    }, [sensors, cctvs, eventType]);

    const selectedSensor = filteredSensors.find((s) => s.sensorId === sensorId);

    const isGas = eventType === 'gas';
    const events = useEventStore((s) => s.events);

    // 선택된 센서에 gas01 활성 이벤트가 있는지 확인 (2단계 허용 조건)
    const hasActiveGas1 = useMemo(() => {
        if (!isGas || !sensorId || !events) return false;
        return events.events.some(
            (e) => e.type === 'gas01' && e.sensorId === sensorId && e.clearedAt === null
        );
    }, [isGas, sensorId, events]);

    // 2단계: 해당 센서에 1단계 활성 이벤트가 있을 때만 선택 가능
    const canSelectLevel2 = isGas && hasActiveGas1;

    const isValid = buildingId !== null && sensorId !== '';

    const closeAllDropdowns = () => {
        setHourOpen(false);
        setMinOpen(false);
        setSecOpen(false);
        setBuildOpen(false);
        setSensorOpen(false);
    };

    const createMutation = useMutation({
        mutationFn: (data: any) => postHttp(BASE_URL + END_POINT.EVENT.ALL + '/', data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['events'] });
            onClose();
        },
    });

    const handleSubmit = () => {
        const d = new Date(date);
        d.setHours(Number(hour), Number(minute), Number(second), 0);
        const type = isGas ? `gas0${level}` : eventType;

        createMutation.mutate({
            type,
            level: isGas ? level : null,
            occurredAt: d.toISOString(),
            buildingCode: buildingId, // building code (E5, W7 등)
            sensorId,
        });
    };

    return (
        <div className="content__frame content__frame--register addEvent active">
            <div className="content__frame__head">
                <h3>수동 이벤트 등록</h3>
                <button type="button" className="btn-close btn-close-02 content-close" onClick={onClose} />
            </div>
            <div className="content__frame__body">
                <div className="container">
                    {/* 이벤트 유형 */}
                    <div className="frame">
                        <p className="label">이벤트 유형</p>
                        <div className="value">
                            <div className="sub-tab__wrap-2">
                                {EVENT_TYPES.map((t) => (
                                    <button key={t.code} type="button"
                                        className={`sub-tab ${eventType === t.code ? 'active' : ''}`}
                                        onClick={() => { setEventType(t.code); setSensorId(''); }}
                                    >{t.label}</button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* 이벤트 단계 */}
                    <div className="frame">
                        <p className="label">이벤트 단계</p>
                        <div className="value">
                            <div className="checkbox-wrap">
                                <label className="checkbox">
                                    <input type="radio" name="step" checked={level === 1} onChange={() => setLevel(1)} disabled={!isGas} />
                                    <span className="checkmark" />
                                    <p className="name">1단계</p>
                                </label>
                                <label className="checkbox">
                                    <input type="radio" name="step" checked={level === 2} onChange={() => setLevel(2)} disabled={!canSelectLevel2} />
                                    <span className="checkmark" />
                                    <p className="name">2단계</p>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* 발생 일시 */}
                    <div className="frame">
                        <p className="label">발생 일시</p>
                        <div className="value">
                            <div className="datepicker__wrap full">
                                <div className="datepicker">
                                    <DatePicker
                                        selected={date}
                                        onChange={(d: Date | null) => d && setDate(d)}
                                        dateFormat="yyyy-MM-dd"
                                        maxDate={new Date()}
                                        className="datepicker__input"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="value frame-wrap">
                            {/* 시 */}
                            <div className="frame">
                                <div className={`select-box mini ${hourOpen ? 'active' : ''}`}>
                                    <button className="btn--select" onClick={() => { closeAllDropdowns(); setHourOpen(!hourOpen); }}>{hour}</button>
                                    <div className="drop-down">
                                        <ul className="ct-scroll">
                                            {HOURS.map((h) => (
                                                <li key={h} className={`select__item ${h === hour ? 'selected' : ''}`}>
                                                    <button onClick={() => { setHour(h); setHourOpen(false); }}>{h}</button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                시
                            </div>
                            {/* 분 */}
                            <div className="frame">
                                <div className={`select-box mini ${minOpen ? 'active' : ''}`}>
                                    <button className="btn--select" onClick={() => { closeAllDropdowns(); setMinOpen(!minOpen); }}>{minute}</button>
                                    <div className="drop-down">
                                        <ul className="ct-scroll">
                                            {MINUTES.map((m) => (
                                                <li key={m} className={`select__item ${m === minute ? 'selected' : ''}`}>
                                                    <button onClick={() => { setMinute(m); setMinOpen(false); }}>{m}</button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                분
                            </div>
                            {/* 초 */}
                            <div className="frame">
                                <div className={`select-box mini ${secOpen ? 'active' : ''}`}>
                                    <button className="btn--select" onClick={() => { closeAllDropdowns(); setSecOpen(!secOpen); }}>{second}</button>
                                    <div className="drop-down">
                                        <ul className="ct-scroll">
                                            {SECONDS.map((s) => (
                                                <li key={s} className={`select__item ${s === second ? 'selected' : ''}`}>
                                                    <button onClick={() => { setSecond(s); setSecOpen(false); }}>{s}</button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                초
                            </div>
                        </div>
                    </div>
                </div>

                {/* 이벤트 위치 */}
                <div className="container">
                    <div className="container__head">
                        <h4>이벤트 위치</h4>
                    </div>
                    <div className="frame">
                        <p className="label">캠퍼스 구역</p>
                        <div className="value">
                            <div className="sub-tab__wrap-2">
                                <button type="button" className={`sub-tab ${area === 'all' ? 'active' : ''}`}
                                    onClick={() => { setArea('all'); setBuildingId(null); setSensorId(''); }}>전체</button>
                                {campusAreas.map((a) => (
                                    <button key={a.code} type="button"
                                        className={`sub-tab ${area === a.code ? 'active' : ''}`}
                                        onClick={() => { setArea(a.code); setBuildingId(null); setSensorId(''); }}
                                    >{a.name}</button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="frame">
                        <div className="frame__head">
                            <p className="label">건물 명</p>
                        </div>
                        <div className="value">
                            <div className={`select-box ${buildOpen ? 'active' : ''}`}>
                                <button className="btn--select" onClick={() => { closeAllDropdowns(); setBuildOpen(!buildOpen); }}>
                                    {selectedBuilding ? `${selectedBuilding.facInfo.facId} ${selectedBuilding.facInfo.facName}` : '선택'}
                                </button>
                                <div className="drop-down">
                                    <ul className="ct-scroll">
                                        {filteredBuildings.map((b) => (
                                            <li key={b.facInfo.facId} className={`select__item ${buildingId === b.facInfo.facId ? 'selected' : ''}`}>
                                                <button onClick={() => { setBuildingId(b.facInfo.facId); setBuildOpen(false); setSensorId(''); }}>
                                                    {b.facInfo.facId} {b.facInfo.facName}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="frame">
                        <div className="frame__head">
                            <p className="label">센서</p>
                        </div>
                        <div className="value">
                            <div className={`select-box ${sensorOpen ? 'active' : ''}`}>
                                <button className="btn--select" onClick={() => { closeAllDropdowns(); setSensorOpen(!sensorOpen); }}>
                                    {selectedSensor ? selectedSensor.sensorName : '선택'}
                                </button>
                                <div className="drop-down">
                                    <ul className="ct-scroll">
                                        {filteredSensors.map((s) => (
                                            <li key={s.sensorId} className={`select__item ${sensorId === s.sensorId ? 'selected' : ''}`}>
                                                <button onClick={() => { setSensorId(s.sensorId); setSensorOpen(false); setLevel(1); }}>
                                                    {s.sensorName}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="content__frame__footer content__frame__footer--end">
                <div className="frame">
                    <button type="button" className="btn btn-normal content-close" onClick={onClose}>취소</button>
                    <button type="button" className="btn btn-primary" disabled={!isValid} onClick={handleSubmit}>등록</button>
                </div>
            </div>
        </div>
    );
};

export default PassiveEventForm;
