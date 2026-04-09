import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import type { CctvType } from '@api/types/fac';
import { useCampusStore } from '@store/campusStore';

const PAGE_SIZE = 8;

interface Props {
    cctvs: CctvType[];
}

const CctvPage = ({ cctvs }: Props) => {
    const { rightCctvPage, setRightCctvPage } = useCampusStore(
        useShallow((s) => ({ rightCctvPage: s.rightCctvPage, setRightCctvPage: s.actions.setRightCctvPage }))
    );
    const [pageList, setPageList] = useState<number[]>([1]);

    useEffect(() => {
        if (!cctvs || cctvs.length === 0) {
            setRightCctvPage(1);
            setPageList([1]);
            return;
        }
        const totalPages = Math.ceil(cctvs.length / PAGE_SIZE);
        setPageList(Array.from({ length: totalPages }, (_, i) => i + 1));
    }, [cctvs]);

    return (
        <div className="content__footer">
            <div className="paging">
                <div className="btn-wrap">
                    <button type="button" className="btn__paging btn__paging--first" disabled={rightCctvPage === 1} onClick={() => setRightCctvPage(1)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M11 16L7 12L11 8" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M15 16L11 12L15 8" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                    <button type="button" className="btn__paging btn__paging--prev" disabled={rightCctvPage === 1} onClick={() => setRightCctvPage(rightCctvPage - 1)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M13 16L9 12L13 8" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
                <div className="num">
                    {pageList.map((page) => (
                        <a key={page} href="#" className={`btn__paging btn__num ${rightCctvPage === page ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setRightCctvPage(page); }}>{page}</a>
                    ))}
                </div>
                <div className="btn-wrap">
                    <button type="button" className="btn__paging btn__paging--next" disabled={rightCctvPage === pageList.length} onClick={() => setRightCctvPage(rightCctvPage + 1)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M11 8L15 12L11 16" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                    <button type="button" className="btn__paging btn__paging--last" disabled={rightCctvPage === pageList.length} onClick={() => setRightCctvPage(pageList.length)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M13 8L17 12L13 16" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M9 8L13 12L9 16" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CctvPage;
