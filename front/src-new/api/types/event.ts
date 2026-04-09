export type EventResponse = {
    totalCnt: number;
    totalPage: number;
    cnt: number;
    page: number;
    events: EventType[];
}

export type EventType = {
    id: number;
    type: string;
    buildingId: number | null;
    buildingCode: string | null;
    sensorId: string;
    occurredAt: string;
    clearedAt: string | null;
}
