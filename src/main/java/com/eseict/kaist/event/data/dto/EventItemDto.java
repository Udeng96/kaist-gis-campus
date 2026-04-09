package com.eseict.kaist.event.data.dto;

import com.eseict.kaist.event.data.vo.TblHist;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EventItemDto {

    private Long id;
    private String type;
    private Long buildingId;
    private String buildingCode;
    private String sensorId;
    private OffsetDateTime occurredAt;
    private OffsetDateTime clearedAt;

    public static EventItemDto from(TblHist event) {
        EventItemDto dto = new EventItemDto();
        dto.setId(event.getId());
        dto.setType(event.getType());
        dto.setBuildingId(event.getBuildingId());
        dto.setSensorId(event.getSensorId());
        dto.setOccurredAt(event.getOccurredAt());
        dto.setClearedAt(event.getClearedAt());
        return dto;
    }
}
