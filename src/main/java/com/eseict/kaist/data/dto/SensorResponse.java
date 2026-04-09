package com.eseict.kaist.data.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SensorResponse {

    private List<SensorType> fireSensors;
    private List<SensorType> gasSensors;

}
