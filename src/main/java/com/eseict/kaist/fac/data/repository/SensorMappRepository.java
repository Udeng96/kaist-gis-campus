package com.eseict.kaist.fac.data.repository;

import com.eseict.kaist.fac.data.vo.TblSensorMapp;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface SensorMappRepository extends JpaRepository<TblSensorMapp, Long> {
    List<TblSensorMapp> findByBuildingId(Long buildingId);
    List<TblSensorMapp> findBySensorIdInAndType(List<String> sensorIds, String type);
    List<TblSensorMapp> findBySensorIdIn(Collection<String> sensorIds);
}
