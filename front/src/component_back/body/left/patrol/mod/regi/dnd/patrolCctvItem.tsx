import type {CCTV_TYPE} from "../../../../../../../data_back/interface/leftInterface.tsx";
import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {
    CCTV_TYPE_FLAME,
    CCTV_TYPE_IN,
    CCTV_TYPE_OUT,
    LEFT_MOD_PATROL_EDIT
} from "../../../../../../../data_back/const/common.ts";
import {useLeftStore} from "../../../../../../../store_back/zustand/left.ts";
import {useShallow} from "zustand/react/shallow";
import {useMainStore} from "../../../../../../../store_back/zustand/main.ts";
import * as React from "react";

const PatrolCctvItem = (props: { cctv: CCTV_TYPE, idx: number }) => {

    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id: `${props.cctv.building}/${props.cctv.streamId}` });
    const activeMod = useMainStore((state)=> state.activeMod);

    const {
        regiPatrolCctvList,
        setRegiPatrolCctvList,
        editPatrolCctvList,
        setEditPatrolCctvList,
    } = useLeftStore(useShallow((state) => ({
        regiPatrolCctvList: state.regiPatrolCctvList,
        setRegiPatrolCctvList: state.actions.setRegiPatrolCctvList,
        editPatrolCctvList: state.editPatrolCctvList,
        setEditPatrolCctvList: state.actions.setEditPatrolCctvList,
    })))

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        borderRadius: 8,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    };

    const setPlaceType = (plcType: string) => {
        if (plcType === CCTV_TYPE_IN.id) {
            return CCTV_TYPE_IN
        } else if (plcType === CCTV_TYPE_OUT.id) {
            return CCTV_TYPE_OUT
        } else {
            return CCTV_TYPE_FLAME
        }
    }

    const handleCancelBtn = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, cctv: CCTV_TYPE) => {
        e.stopPropagation();
        let filterCctv = regiPatrolCctvList.filter((cctvItem) => !(cctv.streamId === cctvItem.streamId && cctvItem.building === cctv.building));
        if(activeMod.cd === LEFT_MOD_PATROL_EDIT.cd){
            filterCctv = editPatrolCctvList.filter((cctvItem) => !(cctv.streamId === cctvItem.streamId && cctvItem.building === cctv.building));
            setEditPatrolCctvList(filterCctv)
        } else{
            setRegiPatrolCctvList(filterCctv)
        }
    }

    return (
        <li
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`patrol__item__box patrol__item__box--${setPlaceType(props.cctv.plcType).cd}`}
        >
            <i>{props.idx + 1}</i>
            <div className="frame">
                <p>{props.cctv.building.substring(0, 1)}구역</p>
                <p>{props.cctv.building}</p>
                <p>{setPlaceType(props.cctv.plcType).nm}</p>
                <p>{props.cctv.cctvNm}</p>
                <button
                    type="button"
                    className="btn-close btn-close-02"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => handleCancelBtn(e,props.cctv)}
                ></button>
            </div>
        </li>
    )
}

export default PatrolCctvItem