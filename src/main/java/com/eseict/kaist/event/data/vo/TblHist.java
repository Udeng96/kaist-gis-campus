package com.eseict.kaist.event.data.vo;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "event", schema = "event")
public class TblHist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "type")
    private String type;

    @Column(name = "building_id")
    private Long buildingId;

    @Column(name = "sensor_id")
    private String sensorId;

    @Column(name = "occurred_at")
    private OffsetDateTime occurredAt;

    @Column(name = "cleared_at")
    private OffsetDateTime clearedAt;

    @Column(name = "created_at", insertable = false, updatable = false)
    private OffsetDateTime createdAt;
}
