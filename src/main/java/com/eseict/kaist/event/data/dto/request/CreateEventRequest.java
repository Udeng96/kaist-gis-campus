package com.eseict.kaist.event.data.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.OffsetDateTime;

@Data
public class CreateEventRequest {

    @NotNull(message = "type은 필수값입니다.")
    private String type;

    private Integer level;

    @NotNull(message = "발생 일시는 필수값입니다.")
    private OffsetDateTime occurredAt;

    private Long buildingId;
    private String buildingCode;  // buildingId 또는 buildingCode 중 하나 필수

    @NotNull(message = "센서는 필수값입니다.")
    private String sensorId;
}
