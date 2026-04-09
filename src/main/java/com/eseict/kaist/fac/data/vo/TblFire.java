package com.eseict.kaist.fac.data.vo;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "fire_sensor", schema = "fac")
public class TblFire {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "sensor_id")
    private String sensorId;

    @Column(name = "panel")
    private String panel;

    @Column(name = "sub_panel")
    private String subPanel;

    @Column(name = "loop")
    private String loop;

    @Column(name = "repeater")
    private String repeater;

    @Column(name = "circuit")
    private BigDecimal circuit;

    @Column(name = "circuit_name")
    private String circuitName;

    @Column(name = "building_id")
    private Long buildingId;

    @Column(name = "area")
    private String area;

    @Column(name = "created_at", insertable = false, updatable = false)
    private OffsetDateTime createdAt;
}
