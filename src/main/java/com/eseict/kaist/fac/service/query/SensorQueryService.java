package com.eseict.kaist.fac.service.query;

import com.eseict.kaist.fac.data.dto.SensorDto;
import com.eseict.kaist.fac.data.repository.FireSensorRepository;
import com.eseict.kaist.fac.data.repository.GasSensorRepository;
import com.eseict.kaist.fac.data.repository.SensorMappRepository;
import com.eseict.kaist.fac.data.vo.TblFire;
import com.eseict.kaist.fac.data.vo.TblGas;
import com.eseict.kaist.fac.data.vo.TblSensorMapp;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@Slf4j
@RequiredArgsConstructor
public class SensorQueryService {

    private final GasSensorRepository gasSensorRepository;
    private final FireSensorRepository fireSensorRepository;
    private final SensorMappRepository sensorMappRepository;

    @Transactional(readOnly = true)
    public List<SensorDto> getAllSensors() {
        return Stream.concat(getGasSensors().stream(), getFireSensors().stream()).collect(Collectors.toList());
    }

    public List<SensorDto> getGasSensors() {
        List<TblGas> gases = gasSensorRepository.findAll();
        Map<String, String> buildingBySensorId = getBuildingIds(gases.stream().map(TblGas::getSensorId).toList());
        return gases.stream()
                .map(g -> SensorDto.convertTblGas(g, buildingBySensorId.getOrDefault(g.getSensorId(), "")))
                .toList();
    }

    public List<SensorDto> getFireSensors() {
        List<TblFire> fires = fireSensorRepository.findAll();
        Map<String, String> buildingBySensorId = getBuildingIds(fires.stream().map(TblFire::getSensorId).toList());
        return fires.stream()
                .map(f -> SensorDto.convertTblFire(f, buildingBySensorId.getOrDefault(f.getSensorId(), "")))
                .toList();
    }

    public Map<String, String> getBuildingIds(List<String> sensorIds) {
        if (sensorIds == null || sensorIds.isEmpty()) return Map.of();
        List<TblSensorMapp> mappings = sensorMappRepository.findBySensorIdIn(sensorIds);
        return mappings.stream()
                .collect(Collectors.groupingBy(
                        TblSensorMapp::getSensorId,
                        Collectors.mapping(m -> String.valueOf(m.getBuildingId()), Collectors.joining("/"))
                ));
    }
}
