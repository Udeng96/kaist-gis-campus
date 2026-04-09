package com.eseict.kaist.event.service.query;

import com.eseict.kaist.event.data.dto.EventDto;
import com.eseict.kaist.event.data.dto.EventItemDto;
import com.eseict.kaist.event.data.repository.EventRepository;
import com.eseict.kaist.event.data.vo.TblHist;
import com.eseict.kaist.fac.data.repository.BuildingRepository;
import com.eseict.kaist.fac.data.vo.TblBuilding;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class EventQueryService {

    private final EventRepository eventRepository;
    private final BuildingRepository buildingRepository;
    private static final ZoneId ZONE = ZoneId.of("Asia/Seoul");

    @org.springframework.beans.factory.annotation.Value("${spring.profiles.active:default}")
    private String activeProfile;

    private boolean isDev() {
        return "default".equals(activeProfile) || "dev".equals(activeProfile);
    }

    public EventDto getAllEvents(String type, Long buildingId, OffsetDateTime startDtm, OffsetDateTime endDtm, int page) {
        boolean isDefaultMode = (startDtm == null || endDtm == null);

        // 개발 모드: 날짜 제한 없이 최근 10개
        if (isDefaultMode && isDev()) {
            Pageable pageable = PageRequest.of(0, 10, Sort.by("occurredAt").descending());
            return convertEventDtoType(eventRepository.findAll(pageable));
        }

        int size = isDefaultMode ? 100 : 7;
        int pageNum = isDefaultMode ? 0 : Math.max(page - 1, 0);

        if (isDefaultMode) {
            LocalDate today = LocalDate.now(ZONE);
            startDtm = today.atStartOfDay(ZONE).toOffsetDateTime();
            endDtm = today.plusDays(1).atStartOfDay(ZONE).toOffsetDateTime();
        }

        return convertEventDtoType(filterSearchOption(buildingId, type, startDtm, endDtm, pageNum, size));
    }

    public EventDto getBuildingEvents(Long buildingId, OffsetDateTime startDtm, OffsetDateTime endDtm) {
        if (startDtm == null || endDtm == null) {
            throw new IllegalArgumentException("startDtm and endDtm must not be null");
        }
        if (buildingId == null) {
            throw new IllegalArgumentException("buildingId must not be null");
        }

        Pageable pageable = PageRequest.of(0, 100, Sort.by("occurredAt").descending());
        return convertEventDtoType(eventRepository.findByOccurredAtBetweenAndBuildingId(startDtm, endDtm, buildingId, pageable));
    }

    private Page<TblHist> filterSearchOption(Long buildingId, String type, OffsetDateTime start, OffsetDateTime end, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("occurredAt").descending());
        boolean ignoreType = isIgnoreType(type);
        boolean ignoreBuilding = (buildingId == null);

        if (!ignoreType && !ignoreBuilding) {
            return eventRepository.findByOccurredAtBetweenAndTypeAndBuildingId(start, end, type, buildingId, pageable);
        }
        if (!ignoreType) {
            return eventRepository.findByOccurredAtBetweenAndType(start, end, type, pageable);
        }
        if (!ignoreBuilding) {
            return eventRepository.findByOccurredAtBetweenAndBuildingId(start, end, buildingId, pageable);
        }
        return eventRepository.findByOccurredAtBetween(start, end, pageable);
    }

    public EventDto convertEventDtoType(Page<TblHist> events) {
        // building ID → code 매핑
        Set<Long> buildingIds = events.getContent().stream()
                .map(TblHist::getBuildingId)
                .filter(id -> id != null)
                .collect(Collectors.toSet());

        Map<Long, String> idToCode = buildingRepository.findAllById(buildingIds).stream()
                .collect(Collectors.toMap(
                        TblBuilding::getId,
                        b -> b.getCode() != null ? b.getCode() : String.valueOf(b.getId())
                ));

        List<EventItemDto> eventItems = events.getContent().stream()
                .map(e -> {
                    EventItemDto dto = EventItemDto.from(e);
                    dto.setBuildingCode(idToCode.getOrDefault(e.getBuildingId(), String.valueOf(e.getBuildingId())));
                    return dto;
                })
                .toList();
        return new EventDto(
                (int) events.getTotalElements(),
                events.getTotalPages(),
                eventItems.size(),
                events.getPageable().getPageNumber(),
                eventItems
        );
    }

    private boolean isIgnoreType(String type) {
        return type == null || type.isEmpty() || "ALL".equalsIgnoreCase(type);
    }
}
