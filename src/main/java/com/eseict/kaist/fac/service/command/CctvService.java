package com.eseict.kaist.fac.service.command;

import com.eseict.kaist.fac.data.dto.request.CreateCctvRequest;
import com.eseict.kaist.fac.data.repository.BuildingRepository;
import com.eseict.kaist.fac.data.repository.CctvRepository;
import com.eseict.kaist.fac.data.repository.SensorMappRepository;
import com.eseict.kaist.fac.data.vo.TblBuilding;
import com.eseict.kaist.fac.data.vo.TblCctv;
import com.eseict.kaist.fac.data.vo.TblSensorMapp;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class CctvService {

    private final CctvRepository cctvRepository;
    private final SensorMappRepository mappRepository;
    private final BuildingRepository buildingRepository;

    @Transactional
    public String createCctv(CreateCctvRequest req) {
        String streamId = generateStreamId(req.getVms());

        if (cctvRepository.existsByStreamId(streamId)) {
            throw new IllegalArgumentException("이미 존재하는 streamId입니다. " + streamId);
        }

        TblCctv cctv = TblCctv.convert(req, streamId);
        cctvRepository.save(cctv);

        TblCctv highCctv = TblCctv.convert(req, streamId + "_HIGH");
        cctvRepository.save(highCctv);

        saveBuildingMappings(req.getBuilding(), streamId);

        return streamId;
    }

    @Transactional
    public String updateCctv(CreateCctvRequest req, String streamId) {
        TblCctv existing = cctvRepository.findByStreamId(streamId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 streamId입니다. " + streamId));

        existing.setCctvNm(req.getCctvNm());
        existing.setIpAddr(req.getIp());
        existing.setRtsp01(req.getRtspUrl());
        existing.setPlcType(req.getType());

        TblCctv highExisting = cctvRepository.findByStreamId(streamId + "_HIGH").orElse(null);
        if (highExisting != null) {
            highExisting.setCctvNm(req.getCctvNm());
            highExisting.setIpAddr(req.getIp());
            highExisting.setRtsp01(req.getRtspUrl().replace("normal", "high"));
            highExisting.setPlcType(req.getType());
        }

        return streamId;
    }

    @Transactional
    public void deleteCctv(String streamId) {
        TblCctv cctv = cctvRepository.findByStreamId(streamId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 streamId입니다. " + streamId));
        cctvRepository.delete(cctv);

        // HIGH 버전도 삭제
        cctvRepository.findByStreamId(streamId + "_HIGH").ifPresent(cctvRepository::delete);

        // sensor_mapping 삭제
        List<TblSensorMapp> mappings = mappRepository.findBySensorIdIn(List.of(streamId));
        if (!mappings.isEmpty()) {
            mappRepository.deleteAll(mappings);
        }
    }

    @Transactional
    public void toggleFavorite(String streamId) {
        TblCctv cctv = cctvRepository.findByStreamId(streamId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 streamId입니다. " + streamId));
        cctv.setIsFavorite(!Boolean.TRUE.equals(cctv.getIsFavorite()));
    }

    /**
     * 건물 코드(E5, W7 등)를 받아서 building ID로 변환 후 sensor_mapping에 저장
     */
    private void saveBuildingMappings(String buildingCodes, String streamId) {
        if (buildingCodes == null || buildingCodes.isBlank()) return;

        for (String code : buildingCodes.split("/")) {
            if (code.isBlank()) continue;
            TblBuilding building = buildingRepository.findByCode(code.trim()).orElse(null);
            if (building == null) {
                log.warn("건물 코드를 찾을 수 없습니다: {}", code);
                continue;
            }
            TblSensorMapp mapping = new TblSensorMapp();
            mapping.setBuildingId(building.getId());
            mapping.setSensorId(streamId);
            mapping.setType("CCTV");
            mappRepository.save(mapping);
        }
    }

    private String generateStreamId(String vms) {
        String prefix = "CCTV" + vms;
        TblCctv latest = cctvRepository.findLatestNormalCctvByPrefix(prefix).orElse(null);

        int nextNumber;
        if (latest == null) {
            nextNumber = 1;
        } else {
            String numericPart = latest.getStreamId().substring(prefix.length());
            nextNumber = Integer.parseInt(numericPart) + 1;
        }
        return prefix + String.format("%03d", nextNumber);
    }
}
