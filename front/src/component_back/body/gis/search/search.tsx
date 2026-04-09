import Result from "./result.tsx";
import {useEffect, useState} from "react";
import {useLeftStore} from "../../../../store_back/zustand/left.ts";
import {useShallow} from "zustand/react/shallow";
import {useGisStore} from "../../../../store_back/zustand/gis.ts";

const Search = () => {
    const {buildingList, cctvList} = useLeftStore(useShallow((state)=> ({
        buildingList : state.buildingList,
        cctvList : state.cctvList,
    })))

    const setActiveFac = useGisStore(state => state.actions.setActiveFac)

    const [inputKeyword, setInputKeyword] = useState<string>("");
    const [searchKeyword, setSearchKeyword] = useState<string>("");
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [result, setResult] = useState<{name: string, type:string, cd:string, xcrdnt:string, ycrdnt:string}[]>([]);

    const handleSearch = () => {
        const newResultList : {name: string, type:string, cd:string, xcrdnt:string, ycrdnt:string}[] = [];
        setSearchKeyword(inputKeyword);

        if(inputKeyword !== ""){
            if(buildingList.length >0){
                buildingList.forEach((building)=> {
                    if(building.name.includes(inputKeyword) || building.id.includes(inputKeyword)){
                        newResultList.push({cd:building.id, type:"building", name:building.name, xcrdnt: building.xcrdnt, ycrdnt: building.ycrdnt });
                    }
                })
            }

            if(cctvList.length > 0){
                cctvList.forEach((cctv)=> {
                    if(cctv.cctvNm.includes(inputKeyword)){
                        newResultList.push({cd:cctv.streamId, type:"cctv", name:cctv.cctvNm, xcrdnt: cctv.xcrdnt, ycrdnt: cctv.ycrdnt });
                    }
                })
            }

            const sorted = [...newResultList].sort((a, b) =>
                a.name.localeCompare(b.name, 'ko-KR', { sensitivity: 'base', numeric: true })
            );

            setResult(sorted);
            setIsOpen(true);
        }else{
            setIsOpen(false);
        }
    }

    useEffect(() => {
        if(searchKeyword === ""){
            setActiveFac(null);
        }
    }, [searchKeyword]);

    return (
        <div className="gis__search active">
            <div className="input">
                <input type="search" placeholder="건물명, CCTV명 입력" className="gis__search__input" value={inputKeyword} onKeyDown={(e)=>{
                    if(e.key === 'Enter'){handleSearch()}}} onChange={(e) => setInputKeyword(e.target.value)}/>
            </div>
            <button type="button" className="btn-search" onClick={()=> handleSearch()}></button>
            {
                isOpen &&
                <Result results={result} keyword={searchKeyword} setIsOpen={setIsOpen}/>
            }
        </div>
    )
}

export default Search