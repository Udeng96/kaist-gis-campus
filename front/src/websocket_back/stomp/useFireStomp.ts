import {useEffect, useMemo, useRef} from "react";
import {Client, type IMessage} from "@stomp/stompjs";

export const useFireStomp = (url: string, subscribeMappings: { topic: string, handler: (message: any) => void }[]) => {

    const stableMappings = useMemo(() => subscribeMappings, [JSON.stringify(subscribeMappings)]);
    // 재연결이 될 때마다 로그가 찍히는 현상을 막기 위해서
    const connectionStatus = useRef<"connected" | "disconnected">("disconnected");

    useEffect(() => {
        let client: Client | null = null;

        const stompClient = new Client({
            webSocketFactory: () => new WebSocket(url),

            debug: (msg) => {
                if (msg.includes("Connection closed")) {
                    if (connectionStatus.current === "connected") {
                        connectionStatus.current = "disconnected";
                        console.log(`[SOCKET-FIRE] 연결 끊김`);
                    }
                    return; // 이후 핑퐁 등 무시
                }

                if (msg.includes("Web Socket Opened") ||
                    msg.includes("connected to server")) {
                    if (connectionStatus.current === "disconnected") {
                        connectionStatus.current = "connected";
                        console.log(`[SOCKET-FIRE}] 연결 성공`);
                    }
                    return;
                }
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 5000,  // 10초 동안 서버에서 heartbeat 안 오면 끊김으로 판단
            heartbeatOutgoing: 5000,  // 10초마다 heartbeat 보냄
            onConnect: () => {
                stableMappings.forEach(({topic, handler}) => {
                    stompClient.subscribe(topic, (message: IMessage) => {
                        handler(JSON.parse(message.body));
                    });
                });
            },
        });

        stompClient.activate();
        client = stompClient;

        return () => {
            client?.deactivate();
        };

    }, [url, stableMappings]);
    return {};
};