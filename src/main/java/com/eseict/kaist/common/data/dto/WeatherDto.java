package com.eseict.kaist.common.data.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WeatherDto {

    private String skyIcon;
    private String skyNm;
    private String ultraDustIcon;
    private String ultraDustNm;
    private String dustIcon;
    private String dustNm;
    private String temp;
    private String report;

}
