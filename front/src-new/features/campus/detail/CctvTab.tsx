import { useEffect, useMemo, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useCampusStore } from '@store/campusStore';
import { useCommonStore } from '@store/commonStore';
import { CCTV_TYPE_CODE } from '@constants/meta';
import CctvPlayerBox from './CctvPlayerBox';
import CctvPage from './CctvPage';

const PAGE_SIZE = 8;

const CctvTab = () => {
    const cctvTypes = useCommonStore((s) => s.cctvType);
    const { highlightCctvs, rightCctvPage, activeBuilding } = useCampusStore(
        useShallow((s) => ({
            highlightCctvs: s.highlightCctvs,
            rightCctvPage: s.rightCctvPage,
            activeBuilding: s.activeBuilding,
        }))
    );

    const cctvs = highlightCctvs;
    const [activeType, setActiveType] = useState('whole');

    useEffect(() => { setActiveType('whole'); }, [activeBuilding]);

    const filtered = useMemo(() => {
        if (activeType === 'whole') return cctvs;
        const typeCode = CCTV_TYPE_CODE[Number(activeType) - 1];
        return cctvs.filter((c) => c.type.toLowerCase() === typeCode);
    }, [cctvs, activeType]);

    const paged = filtered.slice((rightCctvPage - 1) * PAGE_SIZE, rightCctvPage * PAGE_SIZE);

    const countByType = (code: string) => {
        const typeCode = CCTV_TYPE_CODE[Number(code) - 1];
        return cctvs.filter((c) => c.type.toLowerCase() === typeCode).length;
    };

    return (
        <li className="tab__item tab__item--cctv active">
            <div className="content__sub-head">
                <h2 className="content__sub-title">실시간 CCTV<span>{cctvs.length}</span>대</h2>
            </div>
            <div className="preset-wrap">
                <button type="button" className={`btn-preset all ${activeType === 'whole' ? 'active' : ''}`} onClick={() => setActiveType('whole')}>
                    <p className="name whole">전체</p>
                    <p className="value">{cctvs.length}</p>
                </button>
                {cctvTypes.map((type) => (
                    <button key={type.code} type="button" className={`btn-preset ${type.code === activeType ? 'active' : ''}`} onClick={() => setActiveType(type.code)}>
                        <p className={`name ${CCTV_TYPE_CODE[Number(type.code) - 1] ?? ''}`}>{type.name.replace('CCTV', '')}</p>
                        <p className="value">{countByType(type.code)}</p>
                    </button>
                ))}
            </div>
            <div className="cctv__list ct-scroll">
                <ul>
                    {paged.map((cctv, idx) => (
                        <CctvPlayerBox key={cctv.facInfo.facId} num={(rightCctvPage - 1) * PAGE_SIZE + idx + 1} cctv={cctv} />
                    ))}
                </ul>
            </div>
            <CctvPage cctvs={filtered} />
        </li>
    );
};

export default CctvTab;
