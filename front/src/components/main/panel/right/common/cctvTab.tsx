import {useCommonStore} from "../../../../../api/data/common.ts";
import {useEffect, useState} from "react";
import type {CctvType} from "../../../../../api/types/facTypes.ts";
import CctvPlayerBox from "./cctvPlayerBox.tsx";
import CctvPage from "./cctvPage.tsx";
import {useCampusStore} from "../../../../../data/campus.ts";
import {useShallow} from "zustand/react/shallow";

const CctvTab = (props: { cctvs: CctvType[] } ) => {

    const CCTV_TYPE_CODE = ["in", "out", "flame"];
    const cctvTypes = useCommonStore().cctvType;
    const {rightCctvPage ,activeBuilding} = useCampusStore(useShallow((state)=> ({
        rightCctvPage : state.rightCctvPage,
        activeBuilding : state.activeBuilding,

    })));
    const [activeType, setActiceType] = useState<string>('whole');
    const [filterCctv, setFilterCctv] = useState<CctvType[]>([]);

    useEffect(() => {
        if(props.cctvs){
            if (props.cctvs.length > 0) {
                if (activeType !== 'whole') {
                    setFilterCctv(props.cctvs.filter((cctv) => cctv.type.toLocaleLowerCase() === CCTV_TYPE_CODE[Number(activeType) - 1]))
                } else {
                    setFilterCctv(props.cctvs);
                }
            }
        }else{
            setFilterCctv([]);
        }
    }, [props.cctvs, activeType]);

    useEffect(()=>{
        setActiceType('whole');
    },[activeBuilding])

    return (
        <li className={`tab__item tab__item--cctv active`}>
            <div className="content__sub-head">
                <h2 className="content__sub-title">실시간 CCTV<span>{props.cctvs ? props.cctvs.length : 0}</span>대</h2>
            </div>
            <div className={"preset-wrap"}>
                <button key={'preset-whole'} type="button"
                        className={`btn-preset all ${activeType === 'whole' ? 'active' : ''}`}
                        onClick={() => setActiceType('whole')}>
                    <p className={`name whole`}>전체</p>
                    <p className="value">{props.cctvs ? props.cctvs.length : 0}</p>
                </button>
                {

                    cctvTypes.map((type) => (
                        <button key={`preset-${type.code}`} type="button"
                                className={`btn-preset ${type.code === activeType ? 'active' : ''}`}
                                onClick={() => setActiceType(type.code)}>
                            <p className={`name ${CCTV_TYPE_CODE[Number(type.code) - 1]}`}>{type.name.replace("CCTV", "")}</p>
                            <p className="value">{props.cctvs ? props.cctvs.filter((cctv) => cctv.type.toLocaleLowerCase() === CCTV_TYPE_CODE[Number(type.code) - 1]).length : 0}</p>
                        </button>
                    ))
                }
            </div>
            <div className="cctv__list ct-scroll">
                <ul>
                    {
                        filterCctv.length> 0 &&
                        filterCctv.map((cctv,idx)=> (
                            idx >= (rightCctvPage-1)*8 &&
                            idx < rightCctvPage*8 &&
                            <CctvPlayerBox num={idx+1} cctv={cctv}/>
                        ))
                    }
                </ul>
            </div>
            <CctvPage cctvs={filterCctv}/>
        </li>
    )
}


export default CctvTab