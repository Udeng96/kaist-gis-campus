import {useMainStore} from "../../../../../../../store_back/zustand/main.ts";
import {
    CCTV_TYPE_FLAME,
    CCTV_TYPE_IN,
    CCTV_TYPE_OUT,
    MODAL_NONE,
    RIGHT_MOD_CCTV_EDIT,
    RIGHT_MOD_CCTV_REGI,
    RIGHT_MOD_NONE,
    RIGHT_MOD_TAB,
    TOAST_TYPE
} from "../../../../../../../data_back/const/common.ts";
import {useRightStore} from "../../../../../../../store_back/zustand/right.ts";
import {useShallow} from "zustand/react/shallow";
import {useLeftStore} from "../../../../../../../store_back/zustand/left.ts";
import {useEffect, useState} from "react";
import type {CCTV_TYPE} from "../../../../../../../data_back/interface/leftInterface.tsx";
import {DEFAULT_LAT_LNG} from "../../../../../../../data_back/const/gis.ts";
import {delCctvInfo, editCctvInfo, fetchCctvRegi} from "../../../../../../../data_back/api/left/leftApi.ts";
import {useMutation} from "@tanstack/react-query";
import CctvRegiTree from "./building/cctvRegiTree.tsx";

const CctvRegi = () => {

    const {
        buildingList,
        activeCctvType,
        activeBuilding,
        editCctv,
        setEditCctv,
        setCctvList,
        setActiveBuildingCctvs,
        cctvList
    } = useLeftStore(useShallow((state) => ({
        buildingList: state.buildingList,
        activeCctvType: state.activeCctvType,
        activeBuilding: state.activeBuilding,
        editCctv: state.editCctv,
        setEditCctv: state.actions.setEditCctv,
        setCctvList: state.actions.setCctvList,
        setActiveBuildingCctvs: state.actions.setActiveBuildingCctvs,
        cctvList: state.cctvList,
    })));
    const {
        activeRightMod,
        setActiveRightMod,
        activeModal,
        setActiveModal,
        setToast
    } = useMainStore(useShallow((state) => ({
        activeRightMod: state.activeRightMod,
        setActiveRightMod: state.actions.setActiveRightMod,
        activeModal: state.activeModal,
        setActiveModal: state.actions.setActiveModal,
        setToast: state.actions.setActiveToast
    })));
    const {
        regiCctvType,
        regiCctvName,
        regiCctvRtsp,
        regiBuildingYn,
        regiBuilding,
        setRegiCctvType,
        setRegiCctvName,
        setRegiCctvRtsp,
        setRegiBuildingYn,
        setRegiBuilding,
        setRegiCctvLatLng,
        regiCctvLatLng,
        setRegiSearchBuilding,
        regiTreeList,
        regiVmsNum,
        setRegiVmsNum,
    } = useRightStore(useShallow((state) => ({
        regiCctvType: state.regiCctvType,
        regiCctvName: state.regiCctvName,
        regiCctvRtsp: state.regiCctvRtsp,
        regiBuildingYn: state.regiBuildingYn,
        regiBuilding: state.regiBuilding,
        setRegiCctvType: state.actions.setRegiCctvType,
        setRegiCctvName: state.actions.setRegiCctvName,
        setRegiCctvRtsp: state.actions.setRegiCctvRtsp,
        setRegiBuildingYn: state.actions.setRegiBuildingYn,
        setRegiBuilding: state.actions.setRegiBuilding,
        setRegiCctvLatLng: state.actions.setRegiCctvLatLng,
        regiCctvLatLng: state.regiCctvLatLng,
        setRegiSearchBuilding: state.actions.setRegiSearchBuilding,
        regiTreeList: state.regiTreeList,
        regiVmsNum: state.regiVmsNum,
        setRegiVmsNum: state.actions.setRegiVmsNum,
    })))

    const CCTV_TYPES = [CCTV_TYPE_IN, CCTV_TYPE_OUT, CCTV_TYPE_FLAME];

    const [isDsiabled, setIsDisabled] = useState<boolean>(true);
    const [searchBuilding, setSearchBuilding] = useState<string>("");
    const [lastCctvItem, setLastCctvItem] = useState<CCTV_TYPE | null>(null);

    useEffect(() => {
        if (activeRightMod.cd === RIGHT_MOD_CCTV_EDIT.cd) {
            if (editCctv) {
                setRegiCctvType(CCTV_TYPES.filter((type) => type.id === editCctv.plcType)[0]);
                setRegiCctvName(editCctv.cctvNm);
                setRegiCctvRtsp(editCctv.rtsp01);
                setRegiVmsNum(editCctv.streamId.substring(5, 6));
                setRegiBuildingYn(editCctv.building !== '');
                setRegiBuilding(editCctv.building.split(","));
                setRegiCctvLatLng([Number(editCctv.ycrdnt), Number(editCctv.xcrdnt)]);
            }
        } else if (activeRightMod.cd !== RIGHT_MOD_CCTV_REGI.cd) {
            resetCctvRegi();
        }
    }, [activeRightMod, editCctv]);


    useEffect(() => {
        if (cctvList.length > 0) {
            const sorted = cctvList.sort((a, b) => {
                const numA = parseInt(a.streamId.replace(/\D/g, ""), 10);
                const numB = parseInt(b.streamId.replace(/\D/g, ""), 10);
                return numA - numB;
            });
            const filterCctvs = sorted.filter((cctv) => cctv.streamId.includes("CCTV0" + regiVmsNum));
            const lastItem = filterCctvs[filterCctvs.length - 1];
            setLastCctvItem(lastItem);
        }
    }, [regiVmsNum, cctvList]);

    useEffect(() => {
        if (!regiBuildingYn) {
            if (activeRightMod.cd === RIGHT_MOD_CCTV_REGI.cd) {
                setRegiBuilding([]);
            } else if (activeRightMod.cd === RIGHT_MOD_CCTV_EDIT.cd) {
                if (editCctv) {
                    setRegiBuilding(editCctv.building.split(","));
                }
            }
        }
    }, [regiBuildingYn]);

    useEffect(() => {
        if (regiCctvName === "" || regiCctvRtsp === "") {
            setIsDisabled(true);
        } else if (regiCctvType.cd === CCTV_TYPE_IN.cd || regiCctvType.cd === CCTV_TYPE_FLAME.cd) {
            if (!regiBuildingYn || (regiBuildingYn && regiBuilding === null)) {
                setIsDisabled(true);
            } else {
                setIsDisabled(false)
            }
        } else {
            setIsDisabled(false)
        }
    }, [regiCctvName, regiCctvRtsp, regiCctvType, regiBuildingYn, regiBuilding]);

    useEffect(() => {
        if (activeModal.cd === 'CCTV_EXIT_CONFIRM_OK' || activeModal.cd === 'CCTV_EXIT_EDIT_CONFIRM_OK') {
            resetCctvRegi();
            setActiveModal(MODAL_NONE);
        } else if (activeModal.cd === 'CCTV_DEL_CONFIRM_OK' && editCctv !== null) {
            delCctvMutation.mutate({streamId: editCctv.streamId});
            setActiveModal(MODAL_NONE);
        }
    }, [activeModal]);

    const handleCctvType = (cctvType: { id: string, cd: string, nm: string }) => {
        setRegiCctvType(cctvType);
        setRegiBuilding([]);
        setRegiBuildingYn(false);
    }


    const handleCctvName = (e: string) => {
        if (e.length <= 15) {
            setRegiCctvName(e)
        }
    }

    const resetCctvRegi = () => {
        setRegiCctvType(CCTV_TYPE_IN);
        setRegiCctvName('');
        setRegiCctvRtsp('');
        setRegiVmsNum('1');
        setRegiBuildingYn(false);
        setRegiBuilding([]);
        setSearchBuilding("");
        setRegiCctvLatLng(DEFAULT_LAT_LNG);
        if (activeBuilding) {
            setActiveRightMod(RIGHT_MOD_TAB);
        } else {
            setActiveRightMod(RIGHT_MOD_NONE);
        }

        if (activeRightMod.cd === RIGHT_MOD_CCTV_EDIT.cd) {
            setEditCctv(null);
        }
    }

    const handleClsBtn = () => {
        if (activeRightMod.cd === RIGHT_MOD_CCTV_EDIT.cd) {
            setActiveModal({cd: 'CCTV_EXIT_EDIT_CONFIRM', nm: '나가기'});
        } else {
            setActiveModal({cd: 'CCTV_EXIT_CONFIRM', nm: '나가기'});
        }
    }

    const setStreamId = () => {
        const vmsIdx = '0' + regiVmsNum;
        let lastIndex = "0";
        if (lastCctvItem) {
            lastIndex = lastCctvItem.streamId.substring(6, 9);
        }
        return 'CCTV' + vmsIdx + Number(lastIndex) + 1;
    }

    const handleRegiBtn = () => {
        const cctvItem: CCTV_TYPE = {
            streamId: setStreamId(),
            cctvNm: regiCctvName,
            ipAddr: '172.18.16.220',
            health: '0',
            rtsp01: regiCctvRtsp,
            rtsp02: "",
            id: "admin",
            pwd: "rhkrl!2025",
            port: 2022,
            plcType: regiCctvType.id,
            building: regiBuildingYn ? regiBuilding.join(",") : '',
            xcrdnt: regiCctvLatLng[1].toString(),
            ycrdnt: regiCctvLatLng[0].toString(),
            favoriteYn: "0",
        }

        createCctvMutation.mutate(cctvItem);
    }

    const handleEditBtn = () => {
        if (editCctv) {
            const cctvItem: CCTV_TYPE = {
                streamId: editCctv.streamId,
                cctvNm: regiCctvName,
                ipAddr: '172.18.16.220',
                health: '0',
                rtsp01: regiCctvRtsp,
                rtsp02: "",
                id: "admin",
                pwd: "rhkrl!2025",
                port: 2022,
                plcType: regiCctvType.id,
                building: regiBuildingYn ? regiBuilding.join(",") : '',
                xcrdnt: regiCctvLatLng[1].toString(),
                ycrdnt: regiCctvLatLng[0].toString(),
                favoriteYn: "0",
            }
            editCctvMutation.mutate(cctvItem);
        }
    }

    const createCctvMutation = useMutation({
        mutationFn: fetchCctvRegi,
        onSuccess: (data) => {
            if (data) {
                const cctvRes = data as CCTV_TYPE[];

                if (activeBuilding) {
                    const cctvs = cctvRes.filter((cctv) => activeCctvType.id === '0' || cctv.plcType === activeCctvType.id);

                    const includeBuilding = cctvs.filter((cctv) => cctv.building.includes(activeBuilding.id));
                    const notIncludeBuilding = cctvs.filter((cctv) => !cctv.building.includes(activeBuilding.id));
                    const sortCctvs = [...includeBuilding, ...notIncludeBuilding];
                    setCctvList(sortCctvs);
                    setActiveBuildingCctvs(includeBuilding);

                } else {
                    setCctvList(cctvRes);
                    setActiveBuildingCctvs([]);
                }

                setToast({cd: TOAST_TYPE.SUCCESS, msg: "CCTV 등록에 성공하였습니다."});
                resetCctvRegi()

            } else {
                setToast({cd: TOAST_TYPE.ERROR, msg: "CCTV 등록에 실패하였습니다."});
            }
        }
    })

    const editCctvMutation = useMutation({
        mutationFn: editCctvInfo,
        onSuccess: (data) => {
            if (data) {
                const cctvRes = data as CCTV_TYPE[];

                if (activeBuilding) {
                    const cctvs = cctvRes.filter((cctv) => activeCctvType.id === '0' || cctv.plcType === activeCctvType.id);

                    const includeBuilding = cctvs.filter((cctv) => cctv.building.includes(activeBuilding.id));
                    const notIncludeBuilding = cctvs.filter((cctv) => !cctv.building.includes(activeBuilding.id));
                    const sortCctvs = [...includeBuilding, ...notIncludeBuilding];
                    setCctvList(sortCctvs);
                    setActiveBuildingCctvs(includeBuilding);

                } else {
                    setCctvList(cctvRes);
                    setActiveBuildingCctvs([]);
                }
                setToast({cd: TOAST_TYPE.SUCCESS, msg: "CCTV 수정에 성공하였습니다."});
                resetCctvRegi();

            } else {
                setToast({cd: TOAST_TYPE.ERROR, msg: "CCTV 수정에 실패하였습니다."});
            }
        }
    })

    const handleDelTokenBtn = (buildingCd: string) => {
        const filterBuildings = regiBuilding.filter((item) => item !== buildingCd);
        setRegiBuilding(filterBuildings);
    }

    const handleDelBtn = () => {
        setActiveModal({cd: 'CCTV_DEL_CONFIRM', nm: 'CCTV 삭제'});
    }

    const delCctvMutation = useMutation({
        mutationFn: delCctvInfo,
        onSuccess: (data) => {
            if (data) {
                const cctvRes = data as CCTV_TYPE[];
                if(cctvRes && editCctv){
                    setCctvList(cctvList.filter((item)=> item.streamId !== editCctv.streamId));
                    setToast({cd: TOAST_TYPE.SUCCESS, msg: "CCTV 삭제에 성공하였습니다."});
                    resetCctvRegi();
                }else{
                    setToast({cd: TOAST_TYPE.ERROR, msg: "CCTV 삭제에 실패하였습니다."});
                }
            } else {
                setToast({cd: TOAST_TYPE.ERROR, msg: "CCTV 삭제에 실패하였습니다."});
            }
        }
    })

    return (
        <div
            className={`content__frame content__frame--register cctv ${activeRightMod.cd === RIGHT_MOD_CCTV_REGI.cd || activeRightMod.cd === RIGHT_MOD_CCTV_EDIT.cd ? 'active' : ''}`}>
            <div className="content__frame__head">
                <h3>{activeRightMod.nm}</h3>
                <button type="button" className="btn-close btn-close-02 content-close"
                        onClick={() => handleClsBtn()}></button>
            </div>

            <div className="content__frame__body">
                <div className="container">
                    <div className="frame">
                        <p className="label">CCTV 유형</p>
                        <div className="value">
                            <div className="sub-tab__wrap-2">
                                {
                                    CCTV_TYPES.map((cctvType) => (
                                        <button key={'CCTV_REGI ' + cctvType.cd} type="button"
                                                className={`sub-tab ${cctvType.cd === regiCctvType.cd ? 'active' : ''}`}
                                                onClick={() => handleCctvType(cctvType)}>{cctvType.nm}</button>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                    <div className="frame">
                        <div className="frame__head">
                            <p className="label req">CCTV 명</p>
                            <p className="max"><span>{regiCctvName.length}</span>/15</p>
                        </div>
                        <div className="value">
                            <input type="text" placeholder="CCTV 명 입력" value={regiCctvName}
                                   onChange={(e) => handleCctvName(e.target.value)}/>
                        </div>
                    </div>
                    <div className="frame">
                        <p className="label req">RTSP</p>
                        <div className="value">
                            <input type="text" placeholder="RTSP 입력" value={regiCctvRtsp}
                                   onChange={(e) => setRegiCctvRtsp(e.target.value)}/>
                        </div>
                    </div>
                    <div className="frame">
                        <p className="label">VNS 관리번호</p>
                        <div className="value">
                            <div className="sub-tab__wrap-2">
                                <button key={'CCTV_REGI1'} type="button"
                                        className={`sub-tab ${regiVmsNum === '1' ? 'active' : ''}`}
                                        onClick={() => setRegiVmsNum('1')}>1
                                </button>
                                <button key={'CCTV_REGI2'} type="button"
                                        className={`sub-tab ${regiVmsNum === '2' ? 'active' : ''}`}
                                        onClick={() => setRegiVmsNum('2')}>2
                                </button>
                                <button key={'CCTV_REGI3'} type="button"
                                        className={`sub-tab ${regiVmsNum === '3' ? 'active' : ''}`}
                                        onClick={() => setRegiVmsNum('3')}>3
                                </button>

                            </div>
                        </div>
                    </div>
                </div>
                <div className="container">
                    <div className="container__head">
                        <h4>설치 위치</h4>
                    </div>
                    <div className="frame">
                        <div className="frame__head">
                            <p className="label ">소속 건물</p>
                        </div>
                        <div className="value">
                            <div className="checkbox-wrap">
                                <label className="checkbox">
                                    <input type="radio" name="use" checked={regiBuildingYn}
                                           onChange={() => setRegiBuildingYn(true)}/>
                                    <span className="checkmark"></span>
                                    <p className="name">있음</p>
                                </label>
                                <label className="checkbox">
                                    <input type="radio" name="use" checked={!regiBuildingYn}
                                           onChange={() => setRegiBuildingYn(false)}/>
                                    <span className="checkmark"></span>
                                    <p className="name">없음</p>
                                </label>
                            </div>
                        </div>
                        {
                            <div className="value">
                                <div className={`value search-wrap ${regiBuildingYn ? '' : 'disabled'}`}>
                                    <div className="token-wrap">
                                        {
                                            regiBuilding.length === 0 &&
                                            <p className="info">건물을 선택해 주세요.</p>
                                        }
                                        {
                                            regiBuilding.length > 0 &&
                                            buildingList.length > 0 &&
                                            <ul className="token__list">
                                                {
                                                    regiBuilding.map((building, idx) => (
                                                        idx < 2 &&
                                                        <li className="token__item">
                                                            <p>
                                                                <span>{building}</span>{buildingList.filter((item) => item.id === building).length > 0 ? buildingList.filter((item) => item.id === building)[0].name : ''}
                                                            </p>
                                                            <button type="button" className="btn-token-delete"
                                                                    onClick={() => handleDelTokenBtn(building)}></button>
                                                        </li>
                                                    ))
                                                }
                                                {
                                                    regiBuilding.length >= 3 &&
                                                    <li className="full__item">
                                                        <p>
                                                            <span>+</span>{regiBuilding.length - 2}
                                                        </p>
                                                    </li>
                                                }
                                            </ul>
                                        }

                                    </div>
                                    <div className="search-input">
                                        <input type="search" placeholder="건물명 입력"
                                               onChange={(e) => setSearchBuilding(e.target.value)}
                                               value={searchBuilding}/>
                                        <button type="button" className="btn-search"
                                                onClick={() => setRegiSearchBuilding(searchBuilding)}></button>
                                    </div>

                                    <div className="tree-wrap">
                                        <CctvRegiTree/>
                                        {
                                            regiTreeList.length === 0 &&
                                            <p>현재 조건에 해당되는 데이터가 없습니다.</p>
                                        }
                                    </div>


                                </div>

                            </div>
                        }

                    </div>
                </div>
                <div className="content__frame__footer">
                    {
                        activeRightMod.cd === RIGHT_MOD_CCTV_EDIT.cd &&
                        <button type="button" className="btn btn-negative" onClick={() => handleDelBtn()}>삭제</button>
                    }
                    <div className="frame">
                        <button type="button" className="btn btn-normal content-close" onClick={handleClsBtn}>취소
                        </button>
                        {
                            activeRightMod.cd === RIGHT_MOD_CCTV_REGI.cd &&
                            <button type="button" className="btn btn-primary" disabled={isDsiabled}
                                    onClick={handleRegiBtn}>등록</button>
                        }
                        {
                            activeRightMod.cd === RIGHT_MOD_CCTV_EDIT.cd &&
                            <button type="button" className="btn btn-primary" disabled={isDsiabled}
                                    onClick={handleEditBtn}>저장</button>
                        }
                    </div>
                </div>
            </div>


        </div>
    )

}

export default CctvRegi