/** 메타데이터 필터 키 (comm_code type) */
export const META_KEY = {
    LEFT_TAB_TYPE: 'LEFT_TAB_TYPE',
    CCTV_TYPE: 'CCTV_TYPE',
    FAC: 'FAC',
    CAMPUS_AREA: 'CAMPUS_AREA',
    EVENT: 'EVENT',
} as const;

/** CCTV 타입 코드 (소문자 → API 응답의 type과 매핑) */
export const CCTV_TYPE_CODE = ['in', 'out', 'flame'] as const;
