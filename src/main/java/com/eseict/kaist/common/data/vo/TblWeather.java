package com.eseict.kaist.common.data.vo;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
@Table(name = "tbl_weather", schema = "public")
public class TblWeather {

    @Id
    @Column(name = "reg_dtm")
    private String regDtm;

    @Column(name = "upd_dtm")
    private String updDtm;

    @Column(name = "temp")
    private String temp;

    @Column(name = "sky")
    private String sky;

    @Column(name = "dust")
    private String dust;

    @Column(name = "ultra_dust")
    private String ultraDust;

    @Column(name = "pty")
    private String pty;

    @Column(name = "sky_cd")
    private String skyCd;

    @Column(name = "pty_cd")
    private String ptyCd;

    @Column(name = "report_content")
    private String reportContent;

}
