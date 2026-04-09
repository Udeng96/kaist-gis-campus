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
@Table(name = "gas_event", schema = "event")
public class GasEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "event_type")
    private String eventType;

    @Column(name = "area")
    private String area;

    @Column(name = "room")
    private String room;

    @Column(name = "gas_type")
    private String gasType;

    @Column(name = "detector_cd")
    private String detectorCd;

    @Column(name = "occurred_at")
    private OffsetDateTime occurredAt;

    @Column(name = "cleared_at")
    private OffsetDateTime clearedAt;

    @Column(name = "created_at", insertable = false, updatable = false)
    private OffsetDateTime createdAt;
}
