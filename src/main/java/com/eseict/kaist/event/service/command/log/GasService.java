package com.eseict.kaist.event.service.command.log;

import com.eseict.kaist.event.data.dto.request.CreateEventRequest;
import com.eseict.kaist.event.data.repository.log.GasRepository;
import com.eseict.kaist.event.data.vo.log.TblGasLog;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;

@Service
@Slf4j
@RequiredArgsConstructor
public class GasService {

    private final GasRepository gasRepository;

    public void createGasLog(CreateEventRequest req, int status, Long eventId) {
        TblGasLog gasLog = new TblGasLog();
        gasLog.setGasEventId(eventId);
        gasLog.setDetectorCd(req.getSensorId());
        gasLog.setBuildingId(req.getBuildingId());
        gasLog.setLevel(req.getLevel());
        gasLog.setLevelStatus(status);
        gasLog.setDetectedAt(req.getOccurredAt());
        gasRepository.save(gasLog);
    }

    public void createClearGasLog(Long eventId) {
        gasRepository.findByGasEventId(eventId).ifPresent(gasLog -> {
            TblGasLog clearLog = new TblGasLog();
            clearLog.setGasEventId(eventId);
            clearLog.setDetectorCd(gasLog.getDetectorCd());
            clearLog.setBuildingId(gasLog.getBuildingId());
            clearLog.setLevel(gasLog.getLevel());
            clearLog.setLevelStatus(0);
            clearLog.setDetectedAt(OffsetDateTime.now());
            gasRepository.save(clearLog);
        });
    }
}
