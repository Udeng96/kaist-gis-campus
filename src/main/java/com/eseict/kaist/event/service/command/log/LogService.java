package com.eseict.kaist.event.service.command.log;

import com.eseict.kaist.event.data.dto.request.CreateEventRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class LogService {

    private final GasService gasService;
    private final FireService fireService;
    private final FlameService flameService;

    public void createLog(CreateEventRequest req, Long eventId, String type) {
        switch (type) {
            case "gas" -> gasService.createGasLog(req, 1, eventId);
            case "fire" -> fireService.createFireLog(req, 1, eventId);
            default -> flameService.createFlameLog(req, 1, eventId);
        }
    }

    public void createClearLog(String type, Long eventId) {
        switch (type) {
            case "gas" -> gasService.createClearGasLog(eventId);
            case "fire" -> fireService.createClearFireLog(eventId);
            default -> flameService.createClearFlameLog(eventId);
        }
    }
}
