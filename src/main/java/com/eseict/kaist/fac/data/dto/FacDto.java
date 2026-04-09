package com.eseict.kaist.fac.data.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
@AllArgsConstructor
public class FacDto {

    private String facId;
    private String facName;
    private String xCoord;
    private String yCoord;
    private Boolean isFavorite;
    private String facTypeCd;
}
