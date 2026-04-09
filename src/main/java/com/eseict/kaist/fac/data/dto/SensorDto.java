package com.eseict.kaist.fac.data.dto;

import com.eseict.kaist.fac.data.vo.TblFire;
import com.eseict.kaist.fac.data.vo.TblGas;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SensorDto {

    private String sensorId;
    private String sensorName;
    private String xCoord;
    private String yCoord;
    private Boolean isFavorite;
    private String type;
    private String building;

    public static SensorDto convertTblFire(TblFire fireSensor, String buildingId) {
        SensorDto dto = new SensorDto();
        dto.setSensorId(fireSensor.getSensorId());
        dto.setSensorName(fireSensor.getPanel() + "-" + fireSensor.getLoop() + "-" + fireSensor.getCircuit() + "-" + fireSensor.getCircuitName());
        dto.setBuilding(buildingId);
        dto.setType("FIRE");
        return dto;
    }

    public static SensorDto convertTblGas(TblGas gasSensor, String building) {
        SensorDto dto = new SensorDto();
        dto.setSensorId(gasSensor.getSensorId());
        dto.setSensorName(gasSensor.getSensorName());
        dto.setBuilding(building);
        dto.setType("GAS");
        return dto;
    }
}
