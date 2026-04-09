import CheckboxTree from "react-checkbox-tree";
import {useEffect, useState} from "react";
import type {ParentNode, TreeNode} from "../../../../../../../../data_back/interface/leftInterface.tsx";
import {useLeftStore} from "../../../../../../../../store_back/zustand/left.ts";
import {useShallow} from "zustand/react/shallow";
import {useRightStore} from "../../../../../../../../store_back/zustand/right.ts";

import "react-checkbox-tree/lib/react-checkbox-tree.css"
import 'font-awesome/css/font-awesome.min.css';
import {LEFT_CAMPUS_E, LEFT_CAMPUS_N, LEFT_CAMPUS_W} from "../../../../../../../../data_back/const/common.ts";

const CctvRegiTree = () => {

    const {regiCctvType,regiBuilding, setRegiBuilding, regiSearchBuilding, setRegiTreeList} = useRightStore(useShallow((state) => ({
        regiCctvType : state.regiCctvType,
        regiBuilding: state.regiBuilding,
        setRegiBuilding: state.actions.setRegiBuilding,
        regiSearchBuilding: state.regiSearchBuilding,
        setRegiTreeList: state.actions.setRegiTreeList,
    })))

    const {
        buildingList,
    } = useLeftStore(useShallow((state) => ({
        buildingList: state.buildingList,
    })))

    const AREA_LIST = [LEFT_CAMPUS_N, LEFT_CAMPUS_W, LEFT_CAMPUS_E];
    const [treeList, setTreeList] = useState<TreeNode[]>([]);
    const [searchBuildings, setSearchBuildings] = useState<string[]>(['all']);
    const [checked, setChecked] = useState<string[]>([]);
    const [expanded, setExpanded] = useState<string[]>([``]);

    useEffect(() => {
        setChecked(regiBuilding);
    }, [regiBuilding]);

    useEffect(() => {
        if (searchBuildings.length === 0) {
            setRegiTreeList([]);
        }else{
            setRegiTreeList(treeList);
        }
    }, [searchBuildings]);

    useEffect(() => {
        if (buildingList.length > 0 && regiSearchBuilding === "") {
            const rootNode: TreeNode[] = [];
            AREA_LIST.map((area) => {
                const children: ParentNode[] = [];
                const filterBuilding = buildingList.filter((building) => building.id.substring(0, 1) === area.cd);

                filterBuilding.forEach((building) => {
                    children.push({value: building.id, label: building.id + ' ' + building.name});
                })

                rootNode.push({value: area.cd, label: area.nm + ` (${filterBuilding.length})`, children: children});
            })
            setTreeList(rootNode);
        }
    }, [buildingList, regiSearchBuilding]);

    useEffect(() => {
        if (regiSearchBuilding !== '') {

            const rootNode: TreeNode[] = []
            const newSearchBuildings: string[] = [];
            AREA_LIST.map((area) => {
                const children: ParentNode[] = [];
                const filterBuilding = buildingList.filter((building) => building.id.substring(0, 1) === area.cd && building.name.includes(regiSearchBuilding));
                const filterBuildingIds = filterBuilding.map((building) => building.id);
                newSearchBuildings.push(...filterBuildingIds);
                filterBuilding.forEach((building) => {
                    children.push({value: building.id, label: building.id + ' ' + building.name});
                })

                rootNode.push({value: area.cd, label: area.nm + ` (${filterBuilding.length})`, children: children});
            })

            setSearchBuildings(newSearchBuildings);
            setTreeList(rootNode);
        } else {
            setSearchBuildings(['all']);
        }
    }, [regiSearchBuilding]);

    const handleCheck = (checkedList: string[]) => {
        if (regiSearchBuilding !== '') {
            let newSelects: string[] = [];
            // 기존에 선택된 건물에서 검색어에 맞지 않는 건물들을 제외한 리스트 (선택되어 있는 건물들)
            const filterOtherSelect: string[] = regiBuilding.filter((item) => !searchBuildings.includes(item))
            newSelects = [...filterOtherSelect];
            newSelects.push(...checkedList);
            if(regiCctvType.id === '3'){
                if(newSelects.length < 2){
                    setRegiBuilding(newSelects);
                }
            }else{
                setRegiBuilding(newSelects);
            }
        } else {
            setRegiBuilding(checkedList);
        }
    }

    return (
        <>
            {
                <div id="tree02" className="tui-tree-wrap ct-scroll">
                    <CheckboxTree
                        id={"CctvRegiTree"}
                        nodes={treeList}
                        checked={checked}
                        expanded={expanded}
                        onCheck={handleCheck}
                        onExpand={setExpanded}
                    />
                </div>

            }
        </>
    )
}

export default CctvRegiTree