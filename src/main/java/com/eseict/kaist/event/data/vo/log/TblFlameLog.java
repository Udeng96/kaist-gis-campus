package com.eseict.kaist.event.data.vo.log;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "flame_log", schema = "event")
public class TblFlameLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "event_id")
    private Long eventId;

    @Column(name = "sensor_id")
    private String sensorId;

    @Column(name = "building_id")
    private Long buildingId;

    @Column(name = "detected_at")
    private OffsetDateTime detectedAt;

    @Column(name = "created_at", insertable = false, updatable = false)
    private OffsetDateTime createdAt;
}
