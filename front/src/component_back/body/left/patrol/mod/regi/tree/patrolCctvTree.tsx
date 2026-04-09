import {useEffect, useState} from "react";
import {useLeftStore} from "../../../../../../../store_back/zustand/left.ts";
import {useShallow} from "zustand/react/shallow";
import CheckboxTree from "react-checkbox-tree";
import "react-checkbox-tree/lib/react-checkbox-tree.css"
import 'font-awesome/css/font-awesome.min.css';

import type {TreeNode, ParentNode, CCTV_TYPE} from "../../../../../../../data_back/interface/leftInterface.tsx";
import {useMainStore} from "../../../../../../../store_back/zustand/main.ts";
import {LEFT_CAMPUS_N, LEFT_MOD_PATROL_EDIT, LEFT_MOD_PATROL_REGI} from "../../../../../../../data_back/const/common.ts";


const PatrolCctvTree = () => {
    const activeMod = useMainStore((state)=> state.activeMod);
    const {
        cctvList,
        buildingList,
        regiPatrolCctvList,
        regiPatrolCctvArea,
        setRegiPatrolCctvList,
        editPatrolCctvList,
        setEditPatrolCctvList,
        editPatrolCctvArea
    } = useLeftStore(useShallow((state) => ({
        cctvList: state.cctvList,
        buildingList: state.buildingList,
        regiPatrolCctvList: state.regiPatrolCctvList,
        regiPatrolCctvArea: state.regiPatrolArea,
        setRegiPatrolCctvList: state.actions.setRegiPatrolCctvList,
        editPatrolCctvList: state.editPatrolCctvList,
        setEditPatrolCctvList: state.actions.setEditPatrolCctvList,
        editPatrolCctvArea :  state.editPatrolArea,
    })))


    const [activeCctvList, setActiveCctvList] = useState<CCTV_TYPE[]>([]);
    const [activeCctvArea, setActiveCctvArea] = useState<{cd: string, nm : string}>(LEFT_CAMPUS_N);
    const [treeList, setTreeList] = useState<TreeNode[]>([]);
    const [checked, setChecked] = useState<string[]>([]);
    const [expanded, setExpanded] = useState<string[]>([``]);

    useEffect(() => {
        if(activeMod.cd === LEFT_MOD_PATROL_REGI.cd){
            setActiveCctvList(regiPatrolCctvList);
            setActiveCctvArea(regiPatrolCctvArea)
        }else if(activeMod.cd === LEFT_MOD_PATROL_EDIT.cd){
            setActiveCctvList(editPatrolCctvList);
            setActiveCctvArea(editPatrolCctvArea)
        }
    }, [activeMod, regiPatrolCctvList, editPatrolCctvList, regiPatrolCctvArea, editPatrolCctvArea]);

    useEffect(() => {
        if (buildingList.length > 0) {
            const filterBuilding: TreeNode[] = buildingList.filter((building) => building.id.substring(0, 1) === activeCctvArea.cd).map((building, index) => {
                const buildingCd = building.id;

                const filterCctvs: ParentNode[] = cctvList.filter(cctv => cctv.building.split("/").includes(buildingCd))
                    .map(cctv => ({value: buildingCd + "_" + cctv.streamId, label: cctv.cctvNm}));

                return {
                    value: index.toString(),
                    label: building.id + ` (${filterCctvs.length}) `,
                    children: filterCctvs
                };
            });

            setTreeList(filterBuilding);
        }
    }, [cctvList, buildingList, activeCctvArea]);

    useEffect(() => {
        if(activeCctvList.length > 0){
            const filterCctvList = activeCctvList.filter((cctv)=> cctv.building.substring(0,1) === activeCctvArea.cd);
            const checkedList = filterCctvList.map((cctv)=> cctv.building+"_"+cctv.streamId);
           setChecked(checkedList);
        }else{
            setChecked([]);
        }
    }, [activeCctvList, activeCctvArea]);


    const handleCheck = (checkedList: string[]) => {

        let newRegiList: CCTV_TYPE[] = [];
        if(regiPatrolCctvList.length > 0 ){
            newRegiList = regiPatrolCctvList.filter((cctv) => cctv.building.substring(0, 1) !== regiPatrolCctvArea.cd);
        }

        checkedList.map((checkItem) => {
            const cctv = cctvList.find((cctv) => cctv.streamId === checkItem.split("_")[1]);
            if (cctv) {
                cctv.building = checkItem.split("_")[0];
                newRegiList.push(cctv);
            }
        })

        if(activeMod.cd === LEFT_MOD_PATROL_EDIT.cd){
            setEditPatrolCctvList(newRegiList);
        }else if(activeMod.cd === LEFT_MOD_PATROL_REGI.cd){
            setRegiPatrolCctvList(newRegiList);
        }
    }
    return (
        <CheckboxTree
            id={"PatrolTree"}
            nodes={treeList}
            checked={checked}
            expanded={expanded}
            onCheck={handleCheck}
            onExpand={setExpanded}
        />
    )
}

export default PatrolCctvTree