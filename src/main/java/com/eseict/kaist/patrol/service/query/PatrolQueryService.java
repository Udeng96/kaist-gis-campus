package com.eseict.kaist.patrol.service.query;

import com.eseict.kaist.fac.data.repository.CctvRepository;
import com.eseict.kaist.fac.service.port.CctvReadPort;
import com.eseict.kaist.patrol.data.dto.PatrolCctvDto;
import com.eseict.kaist.patrol.data.dto.PatrolDto;
import com.eseict.kaist.patrol.data.repository.PatrolMappRepository;
import com.eseict.kaist.patrol.data.repository.PatrolRepository;
import com.eseict.kaist.patrol.data.vo.TblPatrol;
import com.eseict.kaist.patrol.data.vo.TblPatrolMapp;
import com.eseict.kaist.fac.data.vo.TblCctv;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class PatrolQueryService {

    private final CctvReadPort cctvReadPort;
    private final CctvRepository cctvRepository;
    private final PatrolRepository patrolRepository;
    private final PatrolMappRepository patrolMappRepository;

    @Transactional(readOnly = true)
    public List<PatrolDto> getAllPatrols() {
        List<TblPatrol> patrols = patrolRepository.findAll();
        return patrols.stream()
                .map(patrol -> PatrolDto.convertPatrolDto(patrol, getPatrolCctvs(patrol.getId())))
                .toList();
    }

    private List<PatrolCctvDto> getPatrolCctvs(Long patrolId) {
        List<TblPatrolMapp> mapps = patrolMappRepository.findByPatrolId(patrolId);
        if (mapps.isEmpty()) return List.of();

        return mapps.stream()
                .map(mapp -> {
                    TblCctv cctv = cctvRepository.findById(mapp.getCctvId()).orElse(null);
                    if (cctv == null) return null;
                    return PatrolCctvDto.convertPatrolCctvDto(
                            cctvReadPort.getCctv(cctv.getStreamId()), 0);
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }
}
