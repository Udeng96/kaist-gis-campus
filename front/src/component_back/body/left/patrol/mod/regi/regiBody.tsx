import {useLeftStore} from "../../../../../../store_back/zustand/left.ts";
import {useShallow} from "zustand/react/shallow";
import {
    LEFT_CAMPUS_E,
    LEFT_CAMPUS_N,
    LEFT_CAMPUS_W, LEFT_MOD_PATROL_EDIT,
    LEFT_MOD_PATROL_REGI
} from "../../../../../../data_back/const/common.ts";
import * as React from "react";
import PatrolCctvTree from "./tree/patrolCctvTree.tsx";
import NO_RESULT from "../../../../../../assets/image/img/img_no-result-06_100x100.svg";
import {closestCenter, DndContext, type DragEndEvent, PointerSensor, useSensor, useSensors} from "@dnd-kit/core";
import {arrayMove, SortableContext, verticalListSortingStrategy} from "@dnd-kit/sortable";
import PatrolCctvItem from "./dnd/patrolCctvItem.tsx";
import {useMainStore} from "../../../../../../store_back/zustand/main.ts";
import {useEffect, useState} from "react";
import type {CCTV_TYPE} from "../../../../../../data_back/interface/leftInterface.tsx";


const RegiBody = () => {

    const activeMod = useMainStore((state) => state.activeMod);
    const {
        regiPatrolNm,
        setRegiPatrolNm,
        regiPatrolArea,
        setRegiPatrolArea,
        regiPatrolCctvList,
        setRegiPatrolCctvList,

        editPatrol,
        editPatrolNm,
        setEditPatrolNm,
        editPatrolArea,
        setEditPatrolArea,
        editPatrolCctvList,
        setEditPatrolCctvList,
    } = useLeftStore(useShallow((state) => ({
        regiPatrolNm: state.regiPatrolNm,
        setRegiPatrolNm: state.actions.setRegiPatrolNm,
        regiPatrolArea: state.regiPatrolArea,
        setRegiPatrolArea: state.actions.setRegiPatrolArea,
        regiPatrolCctvList: state.regiPatrolCctvList,
        setRegiPatrolCctvList: state.actions.setRegiPatrolCctvList,

        editPatrol: state.editPatrol,
        editPatrolNm: state.editPatrolNm,
        setEditPatrolNm: state.actions.setEditPatrolNm,
        editPatrolArea: state.editPatrolArea,
        setEditPatrolArea: state.actions.setEditPatrolArea,
        editPatrolCctvList: state.editPatrolCctvList,
        setEditPatrolCctvList: state.actions.setEditPatrolCctvList,
    })))

    const AREA_LIST = [LEFT_CAMPUS_N, LEFT_CAMPUS_W, LEFT_CAMPUS_E];
    const [activeArea, setActiveArea] = useState<{ cd: string, nm: string }>(LEFT_CAMPUS_N);
    const [activeCctvList, setActiveCctvList] = useState<CCTV_TYPE[]>([]);

    //dnd에 모든 포인터 기반 이벤트 감지
    const sensors = useSensors(useSensor(PointerSensor));

    useEffect(() => {
        if (activeMod.cd === LEFT_MOD_PATROL_REGI.cd) {
            setActiveArea(regiPatrolArea);
            setActiveCctvList(regiPatrolCctvList);
        }else{
            setActiveCctvList([]);
        }
    }, [activeMod, regiPatrolNm, regiPatrolArea, regiPatrolCctvList]);

    useEffect(() => {
        if (activeMod.cd === LEFT_MOD_PATROL_EDIT.cd) {
            if (editPatrol) {
                setActiveArea(LEFT_CAMPUS_N);
                setActiveCctvList(editPatrolCctvList);
            }
        }else{
            setActiveCctvList([]);
        }
    }, [activeMod, editPatrolNm, editPatrolArea, editPatrolCctvList]);



    // drag가 끝났을 때 순서변경
    const handleDragEnd = (event: DragEndEvent) => {
        const {active, over} = event;
        if (!over || active.id === over.id) return;

        if (activeMod.cd === LEFT_MOD_PATROL_REGI.cd) {
            setRegiPatrolCctvList(reorderCctvList(active.id as string, over.id as string));
        } else {
            setEditPatrolCctvList(reorderCctvList(active.id as string, over.id as string));
        }
    };

    const reorderCctvList = (activeId: string, overId: string) => {
        let list = [];
        if (activeMod.cd === LEFT_MOD_PATROL_REGI.cd) {
            list = [...regiPatrolCctvList];
        } else {
            list = [...editPatrolCctvList];
        }
        const oldIndex = list.findIndex((i) => i.streamId === activeId.split("/")[1]);
        const newIndex = list.findIndex((i) => i.streamId === overId.split("/")[1]);
        if (oldIndex === -1 || newIndex === -1) return [];
        return arrayMove(list, oldIndex, newIndex);
    };

    const handlePatrolNm = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value.length <= 12) {
            if (activeMod.cd === LEFT_MOD_PATROL_REGI.cd) {
                setRegiPatrolNm(value);
            } else {
                setEditPatrolNm(value);
            }
        }
    };
    const handlePatrolArea = (area: { cd: string, nm: string }) => {

        if (activeMod.cd === LEFT_MOD_PATROL_REGI.cd) {
            setRegiPatrolArea(area);
        } else {
            setEditPatrolArea(area);
        }
    }

    const handleClrCctvs = () => {
        if (activeMod.cd === LEFT_MOD_PATROL_REGI.cd) {
            setRegiPatrolCctvList([]);
        } else {
            setEditPatrolCctvList([]);
        }
    }


    return (
        <div className="content__frame__body">
            <div className="container">
                <div className="frame">
                    <div className="frame__head">
                        <p className="label req">그룹명</p>
                        <p className="max"><span>{activeMod.cd === LEFT_MOD_PATROL_REGI.cd ?regiPatrolNm.length : editPatrolNm.length}</span>/12</p>
                    </div>
                    <div className="value">
                        <input type="text" placeholder="그룹명 입력" style={{padding: "8px 14px"}} value={activeMod.cd === LEFT_MOD_PATROL_REGI.cd ? regiPatrolNm : editPatrolNm}
                               onChange={handlePatrolNm}/>
                    </div>
                </div>
            </div>

            <div className="container">
                <div className="frame">
                    <p className="label">CCTV 리스트</p>
                    <div className="value">
                        <div className="sub-tab__wrap-2">
                            {
                                AREA_LIST.map((area) => (
                                    <button type="button"
                                            className={`sub-tab ${area.cd === activeArea.cd ? 'active' : ''} `}
                                            onClick={() => handlePatrolArea(area)}>{area.cd}구역</button>
                                ))
                            }
                        </div>
                    </div>
                    <div className="value">
                        <div className="tree-wrap">
                            <div id="tree" className="tui-tree-wrap ct-scroll">
                                <PatrolCctvTree/>
                            </div>
                        </div>
                    </div>
                    <div className="value">
                        <p className="info">CCTV는 최소 3개 이상 선택해야 합니다.</p>
                    </div>
                </div>
            </div>


            <div className="list__container">
                <div className="container__head">
                    <h4><span>{activeCctvList.length}대</span> 선택</h4>
                    <button type="button" className="btn-text" disabled={activeCctvList.length === 0}
                            onClick={handleClrCctvs}>전체 삭제
                    </button>
                </div>

                {
                    activeCctvList.length > 0 &&
                    <div className="list list--patrol">
                        <div className="list__head">
                            <p>NO</p>
                            <p>구역</p>
                            <p>건물명</p>
                            <p>유형</p>
                            <p>CCTV명</p>
                        </div>

                        <div className="list__body">
                            <ul className="ct-scroll">
                                <DndContext sensors={sensors} collisionDetection={closestCenter}
                                            onDragEnd={(e) => handleDragEnd(e)}>
                                    <SortableContext items={activeCctvList.map((c) => c.building + "/" + c.streamId)}
                                                     strategy={verticalListSortingStrategy}>
                                        <ul style={{padding: 0, margin: 0}}>
                                            {activeCctvList.map((cctv, idx) => (
                                                <PatrolCctvItem key={`${cctv.building}/${cctv.streamId}`} cctv={cctv}
                                                                idx={idx}/>
                                            ))}
                                        </ul>
                                    </SortableContext>
                                </DndContext>
                            </ul>
                        </div>
                    </div>
                }
                {
                    activeCctvList.length === 0 &&
                    <div className="list__body">
                        <ul className="ct-scroll">

                            <div className="error-frame">
                                <img src={NO_RESULT}/>
                                <p>CCTV를 선택해주세요.</p>
                            </div>
                        </ul>
                    </div>

                }
            </div>
        </div>
    )
}
export default RegiBody