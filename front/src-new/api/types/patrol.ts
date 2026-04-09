import type { CctvType } from './fac';

export type PatrolType = {
    id: number;
    name: string;
    registeredAt: string;
    cctvMapps: PatrolCctvType[];
}

export type PatrolCctvType = {
    order: number;
    cctvInfo: CctvType;
}

export type PatrolRequest = {
    name: string;
    cctvIds: number[];
}
