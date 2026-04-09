import {useShallow} from "zustand/react/shallow";
import {useRightStore} from "../../../../../../store_back/zustand/right.ts";
import {useEffect, useState} from "react";
import type {CCTV_TYPE} from "../../../../../../data_back/interface/leftInterface.tsx";

const CctvLiPage = (props:{cctvs:CCTV_TYPE[]}) => {

    const {activeCctvPage, setActiveCctvPage} = useRightStore(useShallow((state)=> ({
        activeCctvPage : state.activeCctvPage,
        setActiveCctvPage : state.actions.setActiveCctvPage
    })));

    const [pageList, setPageList] = useState<number[]>([1]);

    useEffect(() => {
        if(props.cctvs!==undefined){
            if(props.cctvs.length === 0) {
                setActiveCctvPage(1);
            }else{
                let lastPage = Math.floor(props.cctvs.length / 8) ;
                const extra = props.cctvs.length % 8;
                if(extra === 0 ){
                    lastPage = lastPage -1;
                }
                let newPage : number[] = [];
                for(let i = 0; i<=lastPage; i++){
                    newPage.push(i+1);
                }
                setPageList(newPage);
            }
        }else{
            setPageList([1])
        }

    }, [props.cctvs]);


    return(
        <div className="content__footer">
            <div className="paging">
                <div className="btn-wrap">
                    <button type="button" className="btn__paging btn__paging--first" disabled={activeCctvPage === 1} onClick={()=>setActiveCctvPage(1)}>
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
                    <button type="button" className="btn__paging btn__paging--prev" disabled={activeCctvPage === 1} onClick={()=>setActiveCctvPage(activeCctvPage-1)}>
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
                        pageList.map((page)=>(
                            <a href="#" className={`btn__paging btn__num ${activeCctvPage === page ? 'active' : ''}`} onClick={()=>setActiveCctvPage(page)}>{page}</a>
                        ))
                    }
                </div>
                <div className="btn-wrap">
                    <button type="button" className="btn__paging btn__paging--next" disabled={activeCctvPage === pageList.length} onClick={()=>setActiveCctvPage(activeCctvPage+1)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                             fill="none">
                            <path d="M11 8.00024L15 12.0002L11 16.0002" stroke="currentColor" stroke-width="1.1"
                                  stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                    </button>
                    <button type="button" className="btn__paging btn__paging--last" disabled={activeCctvPage === pageList.length} onClick={()=>setActiveCctvPage(pageList.length)}>
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

export default CctvLiPage