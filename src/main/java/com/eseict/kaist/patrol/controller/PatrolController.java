package com.eseict.kaist.patrol.controller;

import com.eseict.kaist.patrol.data.dto.PatrolDto;
import com.eseict.kaist.patrol.data.dto.PatrolRequest;
import com.eseict.kaist.patrol.service.PatrolService;
import com.eseict.kaist.patrol.service.query.PatrolQueryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.eseict.kaist.config.ApiConstant.API_PRODUCES;

@RestController
@RequestMapping(value = "/patrol", produces = API_PRODUCES)
@Slf4j
@RequiredArgsConstructor
public class PatrolController {

    private final PatrolQueryService patrolQueryService;
    private final PatrolService patrolService;

    @GetMapping("")
    public ResponseEntity<List<PatrolDto>> getAllPatrols() {
        return ResponseEntity.ok(patrolQueryService.getAllPatrols());
    }

    @PostMapping("")
    public ResponseEntity<Long> createPatrol(@Valid @RequestBody PatrolRequest request) {
        return ResponseEntity.ok(patrolService.createPatrol(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Long> updatePatrol(@PathVariable Long id, @Valid @RequestBody PatrolRequest request) {
        return ResponseEntity.ok(patrolService.updatePatrol(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePatrol(@PathVariable Long id) {
        patrolService.deletePatrol(id);
        return ResponseEntity.ok().build();
    }
}
