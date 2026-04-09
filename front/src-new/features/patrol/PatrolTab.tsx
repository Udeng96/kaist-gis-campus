import { useEffect, useState } from 'react';
import { usePatrolStore } from '@store/patrolStore';
import { getHttp } from '@api/http';
import { BASE_URL, END_POINT } from '@api/url';
import type { PatrolType } from '@api/types/patrol';
import PatrolList from './PatrolList';
import PatrolForm from './PatrolForm';

const SORT_OPTIONS = [
    { cd: 'recent', nm: '최근 등록순' },
    { cd: 'abc', nm: '가나다순' },
];

const PatrolTab = () => {
    const patrolList = usePatrolStore((s) => s.patrolList);
    const isEditing = usePatrolStore((s) => s.isEditing);
    const setPatrolList = usePatrolStore((s) => s.actions.setPatrolList);

    const [activeSort, setActiveSort] = useState(SORT_OPTIONS[0]);
    const [isSortOpen, setIsSortOpen] = useState(false);

    const fetchPatrols = async () => {
        const res = await getHttp<PatrolType[]>(BASE_URL + END_POINT.PATROL.ALL);
        setPatrolList(res);
    };

    useEffect(() => {
        fetchPatrols();
    }, []);

    const sortedList = [...patrolList].sort((a, b) => {
        if (activeSort.cd === 'abc') {
            return a.name.localeCompare(b.name);
        }
        return 0; // API 기본 정렬이 최근 등록순
    });

    const handleSort = (sort: typeof SORT_OPTIONS[0]) => {
        setActiveSort(sort);
        setIsSortOpen(false);
    };

    if (isEditing) {
        return <PatrolForm onSaved={fetchPatrols} />;
    }

    return (
        <div className="patrol active">
            <div className="content__sub-head">
                <h2 className="content__sub-title">총<span>{patrolList.length}</span>대</h2>
                <div className={`select-box text ${isSortOpen ? 'active' : ''}`} style={{ minWidth: 100 }}>
                    <button className="btn--select" style={{ minWidth: 110 }} onClick={() => setIsSortOpen(!isSortOpen)}>{activeSort.nm}</button>
                    <div className="drop-down">
                        <ul>
                            {SORT_OPTIONS.map((sort) => (
                                <li key={sort.cd}
                                    className={`select__item ${sort.cd === activeSort.cd ? 'selected' : ''}`}
                                    onClick={() => handleSort(sort)}>
                                    <button>{sort.nm}</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
            <div className="patrol__list">
                <PatrolList patrols={sortedList} onRefresh={fetchPatrols} />
            </div>
        </div>
    );
};

export default PatrolTab;
