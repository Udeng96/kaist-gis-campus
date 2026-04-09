package com.eseict.kaist.event.service.command.log;

import com.eseict.kaist.event.data.dto.request.CreateEventRequest;
import com.eseict.kaist.event.data.repository.log.FlameRepository;
import com.eseict.kaist.event.data.vo.log.TblFlameLog;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;

@RequiredArgsConstructor
@Service
@Slf4j
public class FlameService {

    private final FlameRepository flameRepository;

    public void createFlameLog(CreateEventRequest req, int status, Long eventId) {
        TblFlameLog flameLog = new TblFlameLog();
        flameLog.setEventId(eventId);
        flameLog.setSensorId(req.getSensorId());
        flameLog.setBuildingId(req.getBuildingId());
        flameLog.setDetectedAt(req.getOccurredAt());
        flameRepository.save(flameLog);
    }

    public void createClearFlameLog(Long eventId) {
        flameRepository.findByEventId(eventId).ifPresent(flameLog -> {
            TblFlameLog clearLog = new TblFlameLog();
            clearLog.setEventId(eventId);
            clearLog.setSensorId(flameLog.getSensorId());
            clearLog.setBuildingId(flameLog.getBuildingId());
            clearLog.setDetectedAt(OffsetDateTime.now());
            flameRepository.save(clearLog);
        });
    }
}
