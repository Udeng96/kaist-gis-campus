import {useLeftStore} from "../../../../../../store_back/zustand/left.ts";
import {useMainStore} from "../../../../../../store_back/zustand/main.ts";
import {
    LEFT_CAMPUS_N,
    LEFT_MOD_PATROL,
    LEFT_MOD_PATROL_EDIT,
    LEFT_MOD_PATROL_REGI, MODAL_NONE, TOAST_TYPE
} from "../../../../../../data_back/const/common.ts";
import {useEffect, useState} from "react";
import {useShallow} from "zustand/react/shallow";
import type {PATROL_TYPE} from "../../../../../../data_back/interface/leftInterface.tsx";
import {useMutation} from "@tanstack/react-query";
import {fetchPatrolDelete, fetchPatrolEdit, fetchPatrolRegi} from "../../../../../../data_back/api/left/leftApi.ts";
import moment from "moment";

const RegiFoot = () => {

    const {setActiveMod,activeMod, activeModal, setActiveModal,setActiveToast} = useMainStore(useShallow((state)=> ({
        setActiveMod : state.actions.setActiveMod,
        activeMod : state.activeMod,
        activeModal : state.activeModal,
        setActiveModal :state.actions.setActiveModal,
        setActiveToast : state.actions.setActiveToast
    })));
    const {
        regiPatrolNm,
        regiPatrolCctvList,
        setRegiPatrolNm,
        setRegiPatrolArea,
        setRegiPatrolCctvList,
        setPatrolList,

        editPatrol,
        setEditPatrol,
        editPatrolCctvList,
        setEditPatrolCctvList,
        setEditPatrolArea,
        editPatrolNm,
        setEditPatrolNm,
    } = useLeftStore(useShallow((state) => ({
        regiPatrolNm: state.regiPatrolNm,
        regiPatrolCctvList: state.regiPatrolCctvList,
        setRegiPatrolNm: state.actions.setRegiPatrolNm,
        setRegiPatrolArea: state.actions.setRegiPatrolArea,
        setRegiPatrolCctvList: state.actions.setRegiPatrolCctvList,
        setPatrolList: state.actions.setPatrolList,

        editPatrol : state.editPatrol,
        setEditPatrol : state.actions.setEditPatrol,
        editPatrolCctvList : state.editPatrolCctvList,
        setEditPatrolCctvList : state.actions.setEditPatrolCctvList,
        setEditPatrolArea : state.actions.setEditPatrolArea,
        editPatrolNm : state.editPatrolNm,
        setEditPatrolNm : state.actions.setEditPatrolNm,
    })))
    const [isDisabled, setIsDisabled] = useState<boolean>(false);


    useEffect(() => {
        if(activeMod.cd === LEFT_MOD_PATROL_REGI.cd){
            if (regiPatrolNm === "") {
                setIsDisabled(true);
            } else if (regiPatrolCctvList.length < 3) {
                setIsDisabled(true);
            } else {
                setIsDisabled(false);
            }
        }else if(activeMod.cd === LEFT_MOD_PATROL_EDIT.cd){
            if(editPatrolNm === ""){
                setIsDisabled(true);
            }else if(editPatrolCctvList.length <3){
                setIsDisabled(true);
            }else {
                setIsDisabled(false);
            }
        }

    }, [regiPatrolNm, regiPatrolCctvList, activeMod, editPatrolCctvList, editPatrolNm]);

    useEffect(() => {
        if(activeModal.cd === 'PATROL_EXIT_CONFIRM_OK'){
            resetPatrol()
            setActiveModal(MODAL_NONE)
        }else if(activeModal.cd === 'PATROL_EXIT_EDIT_CONFIRM_OK'){
            resetPatrol()
            setActiveModal(MODAL_NONE)

        }else if(activeModal.cd === 'PATROL_DEL_CONFIRM_OK'){
            if(editPatrol){
                delPatrolMutation.mutate(editPatrol.id);
            }
            setActiveModal(MODAL_NONE)
        }
    }, [activeModal]);

    const resetPatrol = () => {

        if(activeMod.cd === LEFT_MOD_PATROL_REGI.cd) {
            setRegiPatrolNm("");
            setRegiPatrolArea(LEFT_CAMPUS_N);
            setRegiPatrolCctvList([]);
            setActiveMod(LEFT_MOD_PATROL);
        }else if(activeMod.cd === LEFT_MOD_PATROL_EDIT.cd){
            setEditPatrolNm("");
            setEditPatrolArea(LEFT_CAMPUS_N);
            setEditPatrolCctvList([]);
            setEditPatrol(null);
            setActiveMod(LEFT_MOD_PATROL);
        }
    }

    const handleCancelBtn = () => {
        if(activeMod.cd === LEFT_MOD_PATROL_REGI.cd) {
            setActiveModal({cd : 'PATROL_EXIT_CONFIRM', nm : '나가기'});
        }else{
            setActiveModal({cd : 'PATROL_EXIT_EDIT_CONFIRM', nm : '나가기'});
        }
    }

    const handleSaveBtn = () => {
        const savePatrolInfo: PATROL_TYPE = {
            id: '',
            name: regiPatrolNm,
            regDtm: moment().format('YYYYMMDDHHmmss'),
            cctvMappId: regiPatrolCctvList.map((cctv) => cctv.building + "/" + cctv.streamId).join(', '),
        }

        savePatrolMutation.mutate(savePatrolInfo);
    }

    const handleEditBtn = () => {
        if(editPatrol){

            const editParolInfo : PATROL_TYPE = {
                id : editPatrol.id,
                name : editPatrolNm,
                cctvMappId : editPatrolCctvList.map((cctv) => cctv.building + "/" + cctv.streamId).join(', '),
                regDtm : editPatrol.regDtm,
            }

            editPatrolMutation.mutate(editParolInfo);
        }

    }

    const handleDelBtn = () => {
        if(editPatrol){
            setActiveModal({cd : 'PATROL_DEL_CONFIRM', nm : '삭제'});
        }
    }

    const savePatrolMutation = useMutation({
        mutationFn: fetchPatrolRegi,
        onSuccess: (data) => {
            if (data) {
                setActiveToast({cd : TOAST_TYPE.SUCCESS, msg : '순찰 그룹 등록에 성공했습니다.'});
                setPatrolList(data);
                resetPatrol();
            }
        }
    })

    const editPatrolMutation = useMutation({
        mutationFn : fetchPatrolEdit,
        onSuccess : (data)=>{
            if(data){
                setActiveToast({cd : TOAST_TYPE.SUCCESS, msg : '순찰 그룹 수정에 성공했습니다.'});
                setPatrolList(data);
                resetPatrol();
            }
        }
    })

    const delPatrolMutation = useMutation({
        mutationFn : fetchPatrolDelete,
        onSuccess : (data)=>{
            if(data){
                setActiveToast({cd : TOAST_TYPE.SUCCESS, msg : '순찰 그룹 삭제에 성공했습니다.'});
                setPatrolList(data);
                resetPatrol()
            }
        }
    })

    return (
        <>
            <div className="content__frame__footer ">
                {
                    activeMod.cd === LEFT_MOD_PATROL_EDIT.cd &&
                    <button type="button" className="btn btn-negative" onClick={() => handleDelBtn()}>삭제</button>
                }

                <div className="frame">

                    <button type="button" className="btn btn-normal content-close"
                            onClick={() => handleCancelBtn()}>취소
                    </button>
                    {
                        activeMod.cd === LEFT_MOD_PATROL_REGI.cd &&
                        <button type="button" className="btn btn-primary" disabled={isDisabled}
                                onClick={() => handleSaveBtn()}>등록
                        </button>
                    }
                    {
                        activeMod.cd === LEFT_MOD_PATROL_EDIT.cd &&
                        <button type="button" className="btn btn-primary" disabled={isDisabled}
                                onClick={() => handleEditBtn()}>저장
                        </button>
                    }

                </div>
            </div>
        </>
    )
}

export default RegiFoot