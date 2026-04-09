package com.eseict.kaist.fac.service.query;

import com.eseict.kaist.fac.data.dto.CctvDto;
import com.eseict.kaist.fac.data.dto.CctvItemDto;
import com.eseict.kaist.fac.data.repository.BuildingRepository;
import com.eseict.kaist.fac.data.repository.CctvRepository;
import com.eseict.kaist.fac.data.repository.SensorMappRepository;
import com.eseict.kaist.fac.data.vo.TblBuilding;
import com.eseict.kaist.fac.data.vo.TblCctv;
import com.eseict.kaist.fac.data.vo.TblSensorMapp;
import com.eseict.kaist.fac.service.port.CctvReadPort;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class CctvQueryService implements CctvReadPort {

    private final CctvRepository cctvRepository;
    private final SensorMappRepository sensorMappRepository;
    private final BuildingRepository buildingRepository;

    @Override
    public CctvItemDto getCctv(String streamId) {
        TblCctv cctv = cctvRepository.findByStreamId(streamId).orElse(null);
        if (cctv == null) return null;
        return CctvItemDto.convertCCTV(cctv, getBuildingCodesStr(buildingCodeMapByStreamId(List.of(cctv)), cctv.getStreamId()));
    }

    public CctvDto getCctvs(String building, int page, boolean isFavoriteMod) {
        Page<TblCctv> filterCctvs = filterOptions(building, page);
        List<TblCctv> cctvList = filterCctvs.getContent();

        if (isFavoriteMod) {
            cctvList = cctvList.stream().filter(cctv -> Boolean.TRUE.equals(cctv.getIsFavorite())).toList();
        }

        Map<String, List<String>> map = buildingCodeMapByStreamId(cctvList);
        List<CctvItemDto> items = cctvList.stream()
                .map(cctv -> CctvItemDto.convertCCTV(cctv, getBuildingCodesStr(map, cctv.getStreamId())))
                .toList();

        return new CctvDto((int) filterCctvs.getTotalElements(), filterCctvs.getTotalPages(), items.size(), filterCctvs.getPageable().getPageNumber(), items);
    }

    private Page<TblCctv> filterOptions(String building, int page) {
        Pageable pageable = PageRequest.of(0, 5000, Sort.by("streamId").descending());
        if (page > 0) {
            pageable = PageRequest.of(page - 1, 8, Sort.by("streamId").descending());
        }

        if (isIgnoreBuilding(building)) {
            return cctvRepository.findByStreamIdNotLike("%_HIGH", pageable);
        }

        Long buildingId = Long.parseLong(building);
        List<String> streamIds = sensorMappRepository.findByBuildingId(buildingId).stream()
                .map(TblSensorMapp::getSensorId).toList();
        return cctvRepository.findByStreamIdInAndStreamIdNotLike(streamIds, "%_HIGH", pageable);
    }

    /**
     * streamId → [건물 code 목록] 매핑.
     * sensor_mapping의 buildingId(Long)를 building 테이블의 code로 변환.
     */
    private Map<String, List<String>> buildingCodeMapByStreamId(List<TblCctv> cctvs) {
        if (cctvs.isEmpty()) return Map.of();

        List<TblSensorMapp> sensorMapps = sensorMappRepository.findBySensorIdInAndType(
                cctvs.stream().map(TblCctv::getStreamId).toList(), "CCTV");

        // 관련 buildingId 모아서 한 번에 조회
        Set<Long> buildingIds = sensorMapps.stream()
                .map(TblSensorMapp::getBuildingId)
                .collect(Collectors.toSet());

        Map<Long, String> idToCode = buildingRepository.findAllById(buildingIds).stream()
                .collect(Collectors.toMap(
                        TblBuilding::getId,
                        b -> b.getCode() != null ? b.getCode() : String.valueOf(b.getId())
                ));

        return sensorMapps.stream()
                .collect(Collectors.groupingBy(
                        TblSensorMapp::getSensorId,
                        Collectors.mapping(
                                m -> idToCode.getOrDefault(m.getBuildingId(), String.valueOf(m.getBuildingId())),
                                Collectors.toList()
                        )
                ));
    }

    private String getBuildingCodesStr(Map<String, List<String>> cctvMap, String sensorId) {
        return String.join("/", cctvMap.getOrDefault(sensorId, List.of()));
    }

    private boolean isIgnoreBuilding(String building) {
        return building == null || building.isEmpty() || "ALL".equalsIgnoreCase(building);
    }
}
