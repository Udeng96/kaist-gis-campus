package com.eseict.kaist.fac.data.vo;

import com.eseict.kaist.fac.data.dto.request.CreateCctvRequest;
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
@Table(name = "cctv", schema = "fac")
public class TblCctv {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cctv_id")
    private Long cctvId;

    @Column(name = "stream_id")
    private String streamId;

    @Column(name = "cctv_nm")
    private String cctvNm;

    @Column(name = "ip_addr")
    private String ipAddr;

    @Column(name = "port")
    private Integer port;

    @Column(name = "health")
    private String health;

    @Column(name = "rtsp_01")
    private String rtsp01;

    @Column(name = "rtsp_02")
    private String rtsp02;

    @Column(name = "id")
    private String id;

    @Column(name = "pwd")
    private String pwd;

    @Column(name = "plc_type")
    private String plcType;

    @Column(name = "building_id")
    private Long buildingId;

    @Column(name = "x_coord")
    private BigDecimal xCoord;

    @Column(name = "y_coord")
    private BigDecimal yCoord;

    @Column(name = "is_favorite")
    private Boolean isFavorite;

    @Column(name = "created_at", insertable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", insertable = false, updatable = false)
    private OffsetDateTime updatedAt;

    public static TblCctv convert(CreateCctvRequest req, String streamId) {
        TblCctv cctv = new TblCctv();
        cctv.streamId = streamId;
        cctv.cctvNm = req.getCctvNm();
        cctv.ipAddr = req.getIp();
        cctv.health = "0";
        cctv.rtsp01 = streamId.contains("_HIGH") ? req.getRtspUrl().replace("normal", "high") : req.getRtspUrl();
        cctv.rtsp02 = "";
        cctv.id = "admin";
        cctv.pwd = "rhkrl!2026";
        cctv.port = 2022;
        cctv.plcType = req.getType();
        cctv.xCoord = req.getXCoord() != null ? new BigDecimal(req.getXCoord()) : null;
        cctv.yCoord = req.getYCoord() != null ? new BigDecimal(req.getYCoord()) : null;
        cctv.isFavorite = false;
        return cctv;
    }
}
