package com.eseict.kaist.event.service.command.log;

import com.eseict.kaist.event.data.dto.request.CreateEventRequest;
import com.eseict.kaist.event.data.repository.log.FireRepository;
import com.eseict.kaist.event.data.vo.log.TblFireLog;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;

@Service
@Slf4j
@RequiredArgsConstructor
public class FireService {

    private final FireRepository fireRepository;

    public void createFireLog(CreateEventRequest req, int status, Long eventId) {
        TblFireLog fireLog = new TblFireLog();
        fireLog.setEventId(eventId);
        fireLog.setSensorId(req.getSensorId());
        fireLog.setBuildingId(req.getBuildingId());
        fireLog.setStatus(status);
        fireLog.setDetectedAt(req.getOccurredAt());
        fireRepository.save(fireLog);
    }

    public void createClearFireLog(Long eventId) {
        fireRepository.findByEventId(eventId).ifPresent(fireLog -> {
            TblFireLog clearLog = new TblFireLog();
            clearLog.setEventId(eventId);
            clearLog.setSensorId(fireLog.getSensorId());
            clearLog.setBuildingId(fireLog.getBuildingId());
            clearLog.setStatus(0);
            clearLog.setDetectedAt(OffsetDateTime.now());
            fireRepository.save(clearLog);
        });
    }
}
