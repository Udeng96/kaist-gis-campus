package com.eseict.kaist.patrol.data.vo;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "patrol_cctv", schema = "event")
public class TblPatrolMapp {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "patrol_id")
    private Long patrolId;

    @Column(name = "cctv_id")
    private Long cctvId;
}
