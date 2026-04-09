import {useEffect, useRef, useState} from "react";
import ERROR_IMG from "../../../../assets/image/img/img_video-play_28x28.svg";
import {useRightStore} from "../../../../store_back/zustand/right.ts";
import {useShallow} from "zustand/react/shallow";
import type {CCTV_TYPE} from "../../../../data_back/interface/leftInterface.tsx";
import {useGisStore} from "../../../../store_back/zustand/gis.ts";

const GisWebRTCNew = ({cctv, isFull}: { cctv: CCTV_TYPE, isFull: boolean }) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const pcRef = useRef<RTCPeerConnection | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const retryRef = useRef(0);
    const abortRef = useRef<AbortController | null>(null);
    const isStartingRef = useRef(false);
    const cctvList = useGisStore(state => state.playList);

    const sessionRef = useRef(0);

    const [cctvId, setCctvId] = useState<string>("");
    const [isActive, setIsActive] = useState<boolean>(false);

    useEffect(() => {
        console.log(`[${cctv.streamId}] MOUNTED`);

        return () => {
            console.log(`[${cctv.streamId}] UNMOUNTED`);
        };
    }, []);

    useEffect(() => {
        if (isFull) {
            setCctvId(cctv.streamId + "_HIGH");
        } else {
            setCctvId(cctv.streamId);
        }
    }, [cctv]);


    const {isRefresh, setIsRefresh} = useRightStore(
        useShallow((state) => ({
            isRefresh: state.isRefresh,
            setIsRefresh: state.actions.setIsRefresh
        }))
    );


    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);


    const host = window.location.host;
    const scheme = "http://"; // 내부망 고정

    const log = (msg: string) => console.log(`[${cctv.streamId}] ${msg}`);

    // ⭐ 이 컴포넌트 인스턴스의 retry 타이머만 관리
    const retryTimeoutRef = useRef<number | null>(null);

    useEffect(() => {
        if(cctvList.map(item=> item.streamId).includes(cctv.streamId)){
            setIsActive(true);
        }else{
            setIsActive(false);
        }
    }, [cctvList]);



    // ⭐ retry 타이머 정리 함수 (이 컴포넌트 인스턴스만 영향)
    const clearRetryTimeout = () => {
        if (retryTimeoutRef.current !== null) {
            clearTimeout(retryTimeoutRef.current);
            retryTimeoutRef.current = null;
        }
    };

    // ⭐ retry 스케줄 공통 함수
    const scheduleRetry = (sessionId: number, delay: number, fn: () => void) => {
        clearRetryTimeout();
        retryTimeoutRef.current = window.setTimeout(() => {
            if (sessionId !== sessionRef.current) {
                log("retry canceled: session changed");
                return;
            }
            fn();
        }, delay);
    };

    const cleanup = () => {
        abortRef.current?.abort();
        abortRef.current = null;

        try {
            if (pcRef.current) {
                pcRef.current.onconnectionstatechange = null;
                pcRef.current.onicegatheringstatechange = null;
                pcRef.current.ontrack = null;
                pcRef.current.close();
            }
        } catch {
        }

        pcRef.current = null;

        if (streamRef.current) {
            try {
                streamRef.current.getTracks().forEach((t) => t.stop());
            } catch {
            }
        }
        streamRef.current = null;

        const v = videoRef.current;
        if (v) {
            try {
                v.pause();
                // @ts-ignore
                v.srcObject = null;
                v.removeAttribute("src");
                v.load();
            } catch {
            }
        }
    };

    const createPeerConnection = (sessionId: number) => {
        const pc = new RTCPeerConnection({
            iceServers: [], // STUN/TURN 미사용
            bundlePolicy: "max-bundle",
            rtcpMuxPolicy: "require"
        });

        pc.onicegatheringstatechange = () => {
            log(`ICE gathering state: ${pc.iceGatheringState}`);
        };

        pc.onconnectionstatechange = () => {
            // 🔥 오래된 세션이면 이벤트 자체 무시
            if (sessionId !== sessionRef.current) {
                log(`onconnectionstatechange ignored (stale session ${sessionId})`);
                return;
            }

            const s = pc.connectionState;
            log(`connectionState: ${s}`);

            if (s === "connected") {
                retryRef.current = 0;
                setLoading(false);
                setError(false);
            }

            if (s === "failed" || s === "disconnected") {
                const r = retryRef.current++;

                if (r < 6) {
                    const delay = Math.min(30000, 1000 * Math.pow(2, r));
                    const jitter = Math.random() * 200;
                    log(`retry in ${delay + jitter}ms (session ${sessionId})`);

                    scheduleRetry(sessionId, delay + jitter, () => start(sessionId));


                    // setTimeout(() => {
                    //     // 🔥 retry 시점에도 세션 체크
                    //     if (sessionId !== sessionRef.current) {
                    //         log("retry canceled: session changed");
                    //         return;
                    //     }
                    //     start(sessionId);
                    // }, delay + jitter);
                } else {
                    setError(true);
                    setLoading(false);
                    cleanup();
                }
            }
        };

        pc.ontrack = (ev) => {
            // 🔥 오래된 세션이면 스트림도 버림
            if (sessionId !== sessionRef.current) {
                log("ontrack ignored (stale session)");
                return;
            }

            const stream = streamRef.current ?? new MediaStream();
            streamRef.current = stream;
            stream.addTrack(ev.track);

            const attach = () => {
                const v = videoRef.current;
                if (!v) return requestAnimationFrame(attach);
                if (v.srcObject !== stream) {
                    // @ts-ignore
                    v.srcObject = stream;
                    v.play().catch(() => {
                        v.muted = true;
                        v.play().catch(() => {
                        });
                    });
                }
            };
            requestAnimationFrame(attach);
        };

        return pc;
    };

    const start = async (sessionId: number) => {
        // 🔥 이 start 호출이 이미 "옛날 세션"이면 즉시 종료
        if (sessionId !== sessionRef.current) {
            log(`start() ignored: stale session ${sessionId}`);
            return;
        }

        if (isStartingRef.current) {
            log("start() skipped: already starting");
            return;
        }
        isStartingRef.current = true;

        try {
            cleanup();
            setLoading(true);
            setError(false);

            abortRef.current = new AbortController();

            // peer connection 생성
            const pc = createPeerConnection(sessionId);
            pcRef.current = pc;

            // 코덱 정보 요청
            const codecRes = await fetch(`${scheme}${host}/stream/codec/${cctvId}`, {
                signal: abortRef.current.signal,
            });

            if (sessionId !== sessionRef.current) {
                log("start canceled after codec fetch: session changed");
                return;
            }

            // JSON 파싱 에러 방지용
            let codecInfo: any[];
            try {
                codecInfo = await codecRes.json();
            } catch (err) {
                log("codecRes.json() failed, will retry or stop depending on session");
                throw err; // catch 블록으로 보냄
            }

            codecInfo.forEach((c: any) => {
                pc.addTransceiver(c.Type, {direction: "sendrecv"});
            });

            const offer = await pc.createOffer({
                iceRestart: false,
                offerToReceiveAudio: true,
                offerToReceiveVideo: true
            });

            await pc.setLocalDescription(offer);

            if (sessionId !== sessionRef.current) {
                log("start canceled before send offer: session changed");
                return;
            }

            // SDP 전송
            const res = await fetch(`${scheme}${host}/stream/receiver/${cctvId}`, {
                method: "POST",
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                body: new URLSearchParams({
                    suuid: cctvId,
                    data: btoa(pc.localDescription?.sdp || ""),
                }),
                signal: abortRef.current.signal
            });

            if (sessionId !== sessionRef.current) {
                log("start canceled after send offer: session changed");
                return;
            }

            const sdp = atob(await res.text());
            await pc.setRemoteDescription({type: "answer", sdp});

            if (sessionId !== sessionRef.current) {
                log("start canceled after setRemoteDescription: session changed");
                return;
            }

            setIsRefresh(false);
        } catch (e) {
            log(`start() error (session ${sessionId}) : ${(e as Error)?.message ?? e}`);

            // 🔥 여기서도 이미 세션이 바뀐 경우 재시도 아예 안 함
            if (sessionId !== sessionRef.current) {
                log("error retry skipped: session changed");
                return;
            }

            const r = retryRef.current++;
            if (r < 6) {
                const d = Math.min(3000, 1000 * Math.pow(2, r));
                log(`retry in ${d}ms (from catch, session ${sessionId})`);
                scheduleRetry(sessionId, d, () => start(sessionId));
                // setTimeout(() => {
                //     if (sessionId !== sessionRef.current) {
                //         log("retry canceled in catch: session changed");
                //         return;
                //     }
                //     start(sessionId);
                // }, d);
            } else {
                setError(true);
                setLoading(false);
                cleanup();
                setIsRefresh(false);
            }
        } finally {
            if (sessionId === sessionRef.current) {
                isStartingRef.current = false;
            }
        }
    };

    // cctvId 변경 시마다 새로운 세션 시작
    useEffect(() => {

        // ⭐ 1) 아직 cctvId 없는 초기 상태 or 비활성화 상태면
        //     새로 시작하지 말고 그냥 return
        if (!cctvId || !isActive) {
            return;
        }

        // sessionRef.current += 1;
        // const mySession = sessionRef.current;
        //
        // log(`cctvId changed to ${cctvId}, new session = ${mySession}`);


        const mySession = ++sessionRef.current; // ⭐ 세션 증가 후 사용

        log(`cctvId changed to ${cctvId}, new session = ${mySession}`);


        retryRef.current = 0;
        isStartingRef.current = false;
        start(mySession);

        return () => {
            // ⭐ 언마운트 또는 다음 cctvId로 넘어갈 때:
            // 이 인스턴스의 현재 세션을 무효화하고 리소스 정리
            sessionRef.current += 1;
            cleanup();
        };

        // return () => {
        //     // 언마운트 또는 다음 cctvId로 넘어갈 때 정리
        //     cleanup();
        // };
    }, [cctvId, isActive]);

    // 새로고침 플래그
    useEffect(() => {
        if (isRefresh) {
            const reconnect = async () => {
                const mySession = sessionRef.current;

                cleanup();
                await new Promise((r) => setTimeout(r, 300));

                // 🔥 refresh 중에도 세션이 바뀌었으면 아예 실행 안 함
                if (mySession === sessionRef.current) {
                    start(mySession);
                } else {
                    log("refresh canceled: session changed");
                }
            };
            reconnect();
        }
    }, [isRefresh]);

    const el = document.getElementById(`cctv-player-${cctv.streamId}`);
    if (!el) return null;

    return (
        <>
        {loading && !error && (
            <div className="cctv__body loading">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
            </div>
        )}

        {(!loading && error) && (
            <div className="cctv__body error-panel">
                <img src={ERROR_IMG} alt="" />
                <p>표시할 데이터가 없습니다.</p>
            </div>
        )}

        {!loading && !error && (
            <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                controls={false}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
        )}
    </>
    )
};

export default GisWebRTCNew;
