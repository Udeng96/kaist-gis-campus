package com.eseict.kaist.event.service.command;

import com.eseict.kaist.event.data.dto.request.CreateEventRequest;
import com.eseict.kaist.event.data.repository.EventRepository;
import com.eseict.kaist.event.data.vo.TblHist;
import com.eseict.kaist.event.service.command.log.LogService;
import com.eseict.kaist.fac.data.repository.BuildingRepository;
import com.eseict.kaist.fac.data.vo.TblBuilding;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;

@Service
@Slf4j
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final LogService logService;
    private final BuildingRepository buildingRepository;

    @Transactional
    public Long createEvent(CreateEventRequest req) {
        // buildingCode가 있으면 code→ID 변환
        Long buildingId = req.getBuildingId();
        if (buildingId == null && req.getBuildingCode() != null) {
            TblBuilding building = buildingRepository.findByCode(req.getBuildingCode())
                    .orElseThrow(() -> new IllegalArgumentException("건물 코드를 찾을 수 없습니다: " + req.getBuildingCode()));
            buildingId = building.getId();
        }

        TblHist event = new TblHist();
        event.setType(req.getType());
        event.setBuildingId(buildingId);
        event.setSensorId(req.getSensorId());
        event.setOccurredAt(req.getOccurredAt());

        eventRepository.save(event);

        logService.createLog(req, event.getId(), req.getType());
        return event.getId();
    }

    @Transactional
    public Long clearEvent(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("id가 비어있습니다.");
        }

        TblHist event = eventRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 이벤트입니다. id=" + id));

        if (event.getClearedAt() != null) {
            throw new IllegalStateException("이미 처리된 이벤트입니다. id=" + id);
        }

        event.setClearedAt(OffsetDateTime.now());
        logService.createClearLog(event.getType(), event.getId());

        return id;
    }
}
