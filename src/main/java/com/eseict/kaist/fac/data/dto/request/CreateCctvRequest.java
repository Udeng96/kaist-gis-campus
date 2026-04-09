package com.eseict.kaist.fac.data.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateCctvRequest {

    @NotNull(message = "cctvNm은 필수값입니다.")
    private String cctvNm;

    @NotNull(message = "ip는 필수값입니다.")
    private String ip;

    @NotNull(message = "rtspUrl은 필수값입니다.")
    private String rtspUrl;

    @NotNull(message = "type은 필수값입니다.")
    private String type;

    @NotNull(message = "xCoord는 필수값입니다.")
    private String xCoord;

    @NotNull(message = "yCoord는 필수값입니다.")
    private String yCoord;

    private String building;

    @NotNull(message = "vms 관리번호는 필수값입니다.")
    private String vms;
}
