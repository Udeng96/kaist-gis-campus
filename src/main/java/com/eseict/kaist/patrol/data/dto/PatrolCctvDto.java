package com.eseict.kaist.patrol.data.dto;

import com.eseict.kaist.fac.data.dto.CctvItemDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PatrolCctvDto {

    private Integer order;
    private CctvItemDto cctvInfo;

    public static PatrolCctvDto convertPatrolCctvDto(CctvItemDto cctvInfo, int order) {
        if (cctvInfo == null) {return null;}
        return new PatrolCctvDto(order, cctvInfo);
    }
}
