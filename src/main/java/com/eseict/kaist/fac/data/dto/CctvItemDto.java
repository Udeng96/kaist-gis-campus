package com.eseict.kaist.fac.data.dto;

import com.eseict.kaist.fac.data.vo.TblCctv;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CctvItemDto {

    private FacDto facInfo;
    private String rtspUrl;
    private String type;
    private String building;

    private static final java.util.Map<String, String> PLC_TYPE_MAP = java.util.Map.of(
            "1", "IN",
            "2", "OUT",
            "3", "FLAME"
    );

    public static CctvItemDto convertCCTV(TblCctv cctv, String buildings) {
        FacDto dto = new FacDto();
        dto.setFacId(cctv.getStreamId());
        dto.setFacName(cctv.getCctvNm());
        dto.setXCoord(cctv.getXCoord() != null ? cctv.getXCoord().toString() : null);
        dto.setYCoord(cctv.getYCoord() != null ? cctv.getYCoord().toString() : null);
        dto.setIsFavorite(Boolean.TRUE.equals(cctv.getIsFavorite()));
        dto.setFacTypeCd("CCTV");
        String type = PLC_TYPE_MAP.getOrDefault(cctv.getPlcType(), cctv.getPlcType());
        return new CctvItemDto(dto, cctv.getRtsp01(), type, buildings);
    }
}
