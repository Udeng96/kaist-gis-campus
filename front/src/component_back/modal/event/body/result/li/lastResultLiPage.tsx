import {useLeftStore} from "../../../../../../store_back/zustand/left.ts";
import {useShallow} from "zustand/react/shallow";
import {useEffect, useState} from "react";
import type { EVENT_TYPE } from "../../../../../../data_back/interface/leftInterface.tsx";

const LastResultLiPage = (props:{events:EVENT_TYPE[]}) => {

    const {lastEventPage, setLastEventPage} = useLeftStore(useShallow((state)=> ({
        lastEventPage : state.lastEventPage,
        setLastEventPage : state.actions.setLastEventPage
    })));
    const [allPageList, setAllPageList] = useState<number[][]>([[1]]);
    const [activePageList, setActivePageList] = useState<number[]>([1]);
    const [activePageIndex, setActivePageIndex] = useState<number>(0);

    useEffect(() => {
        setLastEventPage(1);
        if (props.events && props.events.length > 0) {
            const allPage = Math.ceil(props.events.length / 8);
            const allIndex = Math.floor(allPage / 9);

            let newAllPageList : number[][] = [];
            for(let i = 0; i<=allIndex; i++){
                const newList = [];
                let lastPage = 9;
                if(i === allIndex){
                    lastPage = allPage % 9;
                }
                for(let j = 0; j<lastPage; j++){
                    if(i === 0){
                        newList.push(i*10+j+1);
                    }else{
                        newList.push(i*10+j);
                    }
                }
                newAllPageList = ([...newAllPageList, newList]);
            }
            setAllPageList(newAllPageList);
        } else {
            setAllPageList([[1]]);
        }
    }, [props.events]);


    useEffect(() => {
        const index = Math.floor(lastEventPage/10);
        setActivePageIndex(index);
        setActivePageList(allPageList[index]);
    }, [lastEventPage, allPageList]);

    const handleLastPage = () => {
        const lastPageList = allPageList[allPageList.length - 1];
        const lastPage = lastPageList[lastPageList.length - 1];
        setLastEventPage(lastPage);
    }


    return(
        <div className="paging">
            <div className="btn-wrap">
                <button type="button" className="btn__paging btn__paging--first" disabled={lastEventPage === 1} onClick={()=>setLastEventPage(1)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                         viewBox="0 0 24 24" fill="none">
                        <g>
                            <path d="M11 16L7 12L11 8" stroke="currentColor" stroke-width="1.1"
                                  stroke-linecap="round" stroke-linejoin="round"></path>
                            <path d="M15 16.0002L11 12.0002L15 8.00024" stroke="currentColor"
                                  stroke-width="1.1" stroke-linecap="round"
                                  stroke-linejoin="round"></path>
                        </g>
                    </svg>
                </button>
                <button type="button" className="btn__paging btn__paging--prev" disabled={lastEventPage === 1} onClick={()=>setLastEventPage(lastEventPage-1)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                         viewBox="0 0 24 24" fill="none">
                        <g>
                            <path d="M13 16.0002L9 12.0002L13 8.00024" stroke="currentColor"
                                  stroke-width="1.1" stroke-linecap="round"
                                  stroke-linejoin="round"></path>
                        </g>
                    </svg>
                </button>
            </div>
            <div className="num">
                {
                    activePageList.map((page)=>(
                        <a href="#" className={`btn__paging btn__num ${lastEventPage === page ? 'active' : ''}`} onClick={()=>setLastEventPage(page)}>{page}</a>
                    ))
                }
            </div>
            <div className="btn-wrap">
                <button type="button" className="btn__paging btn__paging--next" disabled={activePageIndex === allPageList.length-1 && lastEventPage === activePageList[activePageList.length-1]} onClick={()=>setLastEventPage(lastEventPage+1)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                         viewBox="0 0 24 24" fill="none">
                        <path d="M11 8.00024L15 12.0002L11 16.0002" stroke="currentColor"
                              stroke-width="1.1" stroke-linecap="round"
                              stroke-linejoin="round"></path>
                    </svg>
                </button>
                <button type="button" className="btn__paging btn__paging--last" disabled={activePageIndex === allPageList.length-1 && lastEventPage === activePageList[activePageList.length-1]} onClick={()=>handleLastPage()}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                         viewBox="0 0 24 24" fill="none">
                        <path d="M13 8.00024L17 12.0002L13 16.0002" stroke="currentColor"
                              stroke-width="1.1" stroke-linecap="round"
                              stroke-linejoin="round"></path>
                        <path d="M9 8.00012L13 12.0001L9 16.0001" stroke="currentColor"
                              stroke-width="1.1" stroke-linecap="round"
                              stroke-linejoin="round"></path>
                    </svg>
                </button>
            </div>
        </div>
    )
}

export default LastResultLiPage