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
@Table(name = "building", schema = "fac")
public class TblBuilding {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "code")
    private String code;

    @Column(name = "name")
    private String name;

    @Column(name = "area")
    private String area;

    @Column(name = "note")
    private String note;

    @Column(name = "is_favorite")
    private Boolean isFavorite;

    @Column(name = "x_coord")
    private BigDecimal xCoord;

    @Column(name = "y_coord")
    private BigDecimal yCoord;

    @Column(name = "created_at", insertable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", insertable = false, updatable = false)
    private OffsetDateTime updatedAt;
}
