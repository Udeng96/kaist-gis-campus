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
@Table(name = "gas_sensor", schema = "fac")
public class TblGas {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "sensor_id")
    private String sensorId;

    @Column(name = "sensor_name")
    private String sensorName;

    @Column(name = "building_id")
    private Long buildingId;

    @Column(name = "created_at", insertable = false, updatable = false)
    private OffsetDateTime createdAt;
}
