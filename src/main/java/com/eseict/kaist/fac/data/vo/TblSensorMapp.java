package com.eseict.kaist.fac.data.vo;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "sensor_mapping", schema = "fac")
public class TblSensorMapp {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "building_id")
    private Long buildingId;

    @Column(name = "sensor_id")
    private String sensorId;

    @Column(name = "type")
    private String type;

    @Column(name = "created_at", insertable = false, updatable = false)
    private OffsetDateTime createdAt;
}
