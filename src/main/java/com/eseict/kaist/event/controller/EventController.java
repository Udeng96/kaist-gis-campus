package com.eseict.kaist.event.controller;

import com.eseict.kaist.event.data.dto.EventDto;
import com.eseict.kaist.event.data.dto.request.CreateEventRequest;
import com.eseict.kaist.event.service.command.EventService;
import com.eseict.kaist.event.service.query.EventQueryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;

import static com.eseict.kaist.config.ApiConstant.API_PRODUCES;

@RestController
@RequestMapping(value = "/event", produces = API_PRODUCES)
@Slf4j
@RequiredArgsConstructor
public class EventController {

    private final EventQueryService eventQueryService;
    private final EventService eventService;

    @GetMapping("")
    public ResponseEntity<EventDto> getAllEvents(
            @RequestParam(value = "startDtm", required = false) OffsetDateTime startDtm,
            @RequestParam(value = "endDtm", required = false) OffsetDateTime endDtm,
            @RequestParam(value = "type", defaultValue = "all") String type,
            @RequestParam(value = "buildingId", required = false) Long buildingId,
            @RequestParam(value = "page", defaultValue = "0") int page
    ) {
        return ResponseEntity.ok(eventQueryService.getAllEvents(type, buildingId, startDtm, endDtm, page));
    }

    @GetMapping("/building")
    public ResponseEntity<EventDto> getBuildingEvents(
            @RequestParam(value = "startDtm") OffsetDateTime startDtm,
            @RequestParam(value = "endDtm") OffsetDateTime endDtm,
            @RequestParam(value = "buildingId") Long buildingId
    ) {
        return ResponseEntity.ok(eventQueryService.getBuildingEvents(buildingId, startDtm, endDtm));
    }

    @PostMapping("/")
    public ResponseEntity<Long> createEvent(@Valid @RequestBody CreateEventRequest createEventRequest) {
        return ResponseEntity.ok(eventService.createEvent(createEventRequest));
    }

    @PutMapping("/clear/{id}")
    public ResponseEntity<Long> clearEvent(@PathVariable Long id) {
        return ResponseEntity.ok(eventService.clearEvent(id));
    }
}
