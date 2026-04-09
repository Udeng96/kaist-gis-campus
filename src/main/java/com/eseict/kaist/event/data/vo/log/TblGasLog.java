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
@Table(name = "gas_log", schema = "event")
public class TblGasLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "gas_event_id")
    private Long gasEventId;

    @Column(name = "detector_cd")
    private String detectorCd;

    @Column(name = "building_id")
    private Long buildingId;

    @Column(name = "level")
    private Integer level;

    @Column(name = "level_status")
    private Integer levelStatus;

    @Column(name = "detected_at")
    private OffsetDateTime detectedAt;

    @Column(name = "created_at", insertable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "mssql_idx")
    private Integer mssqlIdx;
}
