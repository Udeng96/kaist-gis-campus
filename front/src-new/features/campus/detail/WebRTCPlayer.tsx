import { useEffect, useRef, useState } from 'react';
import ERROR_IMG from '@assets/image/img/img_video-play_28x28.svg';

interface Props {
    cctvId: string;
    refresh?: boolean;
    onRefreshDone?: () => void;
}

const WebRTCPlayer = ({ cctvId, refresh = false, onRefreshDone }: Props) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const pcRef = useRef<RTCPeerConnection | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const retryRef = useRef(0);
    const abortRef = useRef<AbortController | null>(null);
    const isStartingRef = useRef(false);
    const sessionRef = useRef(0);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const host = window.location.host;
    const scheme = 'http://';

    const log = (msg: string) => console.log(`[${cctvId}] ${msg}`);

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
        } catch { /* ignore */ }
        pcRef.current = null;
        streamRef.current = null;
        const v = videoRef.current;
        if (v) {
            try { v.pause(); (v as any).srcObject = null; v.removeAttribute('src'); v.load(); } catch { /* ignore */ }
        }
    };

    const createPeerConnection = (sessionId: number) => {
        const pc = new RTCPeerConnection({ iceServers: [], bundlePolicy: 'max-bundle', rtcpMuxPolicy: 'require' });

        pc.onconnectionstatechange = () => {
            if (sessionId !== sessionRef.current) return;
            const s = pc.connectionState;
            log(`connectionState: ${s}`);
            if (s === 'connected') { retryRef.current = 0; setLoading(false); setError(false); }
            if (s === 'failed' || s === 'disconnected') {
                const r = retryRef.current++;
                if (r < 6) {
                    const delay = Math.min(30000, 1000 * Math.pow(2, r)) + Math.random() * 200;
                    setTimeout(() => { if (sessionId === sessionRef.current) start(sessionId); }, delay);
                } else { setError(true); setLoading(false); cleanup(); }
            }
        };

        pc.ontrack = (ev) => {
            if (sessionId !== sessionRef.current) return;
            const stream = streamRef.current ?? new MediaStream();
            streamRef.current = stream;
            stream.addTrack(ev.track);
            const attach = () => {
                const v = videoRef.current;
                if (!v) return requestAnimationFrame(attach);
                if (v.srcObject !== stream) {
                    (v as any).srcObject = stream;
                    v.play().catch(() => { v.muted = true; v.play().catch(() => {}); });
                }
            };
            requestAnimationFrame(attach);
        };

        return pc;
    };

    const start = async (sessionId: number) => {
        if (sessionId !== sessionRef.current || isStartingRef.current) return;
        isStartingRef.current = true;

        try {
            cleanup();
            setLoading(true);
            setError(false);
            abortRef.current = new AbortController();

            const pc = createPeerConnection(sessionId);
            pcRef.current = pc;

            const codecRes = await fetch(`${scheme}${host}/stream/codec/${cctvId}`, { signal: abortRef.current.signal });
            if (sessionId !== sessionRef.current) return;

            const codecInfo: any[] = await codecRes.json();
            codecInfo.forEach((c: any) => pc.addTransceiver(c.Type, { direction: 'sendrecv' }));

            const offer = await pc.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: true });
            await pc.setLocalDescription(offer);
            if (sessionId !== sessionRef.current) return;

            const res = await fetch(`${scheme}${host}/stream/receiver/${cctvId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({ suuid: cctvId, data: btoa(pc.localDescription?.sdp || '') }),
                signal: abortRef.current.signal,
            });
            if (sessionId !== sessionRef.current) return;

            const sdp = atob(await res.text());
            await pc.setRemoteDescription({ type: 'answer', sdp });

            onRefreshDone?.();
        } catch (e) {
            log(`start() error: ${(e as Error)?.message ?? e}`);
            if (sessionId !== sessionRef.current) return;
            const r = retryRef.current++;
            if (r < 6) {
                const d = Math.min(3000, 1000 * Math.pow(2, r));
                setTimeout(() => { if (sessionId === sessionRef.current) start(sessionId); }, d);
            } else { setError(true); setLoading(false); cleanup(); onRefreshDone?.(); }
        } finally {
            if (sessionId === sessionRef.current) isStartingRef.current = false;
        }
    };

    useEffect(() => {
        sessionRef.current += 1;
        const mySession = sessionRef.current;
        retryRef.current = 0;
        isStartingRef.current = false;
        start(mySession);
        return () => cleanup();
    }, [cctvId]);

    useEffect(() => {
        if (!refresh) return;
        const reconnect = async () => {
            const mySession = sessionRef.current;
            cleanup();
            await new Promise((r) => setTimeout(r, 300));
            if (mySession === sessionRef.current) start(mySession);
        };
        reconnect();
    }, [refresh]);

    return (
        <>
            {loading && !error && (
                <div className="cctv__body loading">
                    <div className="dot" /><div className="dot" /><div className="dot" />
                </div>
            )}
            {error && (
                <div className="cctv__body error-panel">
                    <img src={ERROR_IMG} alt="" />
                    <p>표시할 데이터가 없습니다.</p>
                </div>
            )}
            {!loading && !error && (
                <video ref={videoRef} autoPlay muted playsInline controls={false} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            )}
        </>
    );
};

export default WebRTCPlayer;
