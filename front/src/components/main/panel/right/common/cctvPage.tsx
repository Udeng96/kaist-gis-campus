import {useEffect, useState} from "react";
import type {CctvType} from "../../../../../api/types/facTypes.ts";
import {useCampusStore} from "../../../../../data/campus.ts";
import {useShallow} from "zustand/react/shallow";

const CctvPage = (props: { cctvs: CctvType[] }) => {

    const {rightCctvPage, setRightCctvPage} = useCampusStore(useShallow((state) => ({
        rightCctvPage: state.rightCctvPage,
        setRightCctvPage: state.actions.setRightCctvPage,
    })))
    const [pageList, setPageList] = useState<number[]>([1]);

    useEffect(() => {
        if (props.cctvs !== undefined) {
            if (props.cctvs.length === 0) {
                setRightCctvPage(1);
            } else {
                let lastPage = Math.floor(props.cctvs.length / 8);
                const extra = props.cctvs.length % 8;
                if (extra === 0) {
                    lastPage = lastPage - 1;
                }
                let newPage: number[] = [];
                for (let i = 0; i <= lastPage; i++) {
                    newPage.push(i + 1);
                }
                setPageList(newPage);
            }
        } else {
            setPageList([1])
        }

    }, [props.cctvs]);


    return (
        <div className="content__footer">
            <div className="paging">
                <div className="btn-wrap">
                    <button type="button" className="btn__paging btn__paging--first" disabled={rightCctvPage === 1}
                            onClick={() => setRightCctvPage(1)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                             fill="none">
                            <g>
                                <path d="M11 16L7 12L11 8" stroke="currentColor" stroke-width="1.1"
                                      stroke-linecap="round" stroke-linejoin="round"></path>
                                <path d="M15 16.0002L11 12.0002L15 8.00024" stroke="currentColor"
                                      stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"></path>
                            </g>
                        </svg>
                    </button>
                    <button type="button" className="btn__paging btn__paging--prev" disabled={rightCctvPage === 1}
                            onClick={() => setRightCctvPage(rightCctvPage - 1)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                             fill="none">
                            <g>
                                <path d="M13 16.0002L9 12.0002L13 8.00024" stroke="currentColor"
                                      stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"></path>
                            </g>
                        </svg>
                    </button>
                </div>
                <div className="num">
                    {
                        pageList.map((page) => (
                            <a href="#" className={`btn__paging btn__num ${rightCctvPage === page ? 'active' : ''}`}
                               onClick={() => setRightCctvPage(page)}>{page}</a>
                        ))
                    }
                </div>
                <div className="btn-wrap">
                    <button type="button" className="btn__paging btn__paging--next"
                            disabled={rightCctvPage === pageList.length} onClick={() => setRightCctvPage(rightCctvPage + 1)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                             fill="none">
                            <path d="M11 8.00024L15 12.0002L11 16.0002" stroke="currentColor" stroke-width="1.1"
                                  stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                    </button>
                    <button type="button" className="btn__paging btn__paging--last"
                            disabled={rightCctvPage === pageList.length} onClick={() => setRightCctvPage(pageList.length)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                             fill="none">
                            <path d="M13 8.00024L17 12.0002L13 16.0002" stroke="currentColor" stroke-width="1.1"
                                  stroke-linecap="round" stroke-linejoin="round"></path>
                            <path d="M9 8.00012L13 12.0001L9 16.0001" stroke="currentColor" stroke-width="1.1"
                                  stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CctvPage