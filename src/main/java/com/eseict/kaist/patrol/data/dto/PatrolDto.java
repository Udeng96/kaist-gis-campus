package com.eseict.kaist.patrol.data.dto;

import com.eseict.kaist.patrol.data.vo.TblPatrol;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PatrolDto {

    private Long id;
    private String name;
    private OffsetDateTime registeredAt;
    private List<PatrolCctvDto> cctvMapps;

    public static PatrolDto convertPatrolDto(TblPatrol patrol, List<PatrolCctvDto> cctvMapps) {
        return new PatrolDto(patrol.getId(), patrol.getName(), patrol.getRegisteredAt(), cctvMapps);
    }
}
