package com.eseict.kaist.data.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SensorType {
    private String cd;
    private String nm;
    private String building;
}
