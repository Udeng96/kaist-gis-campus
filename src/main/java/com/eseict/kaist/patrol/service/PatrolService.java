package com.eseict.kaist.patrol.service;

import com.eseict.kaist.fac.data.repository.CctvRepository;
import com.eseict.kaist.fac.data.vo.TblCctv;
import com.eseict.kaist.patrol.data.dto.PatrolRequest;
import com.eseict.kaist.patrol.data.repository.PatrolMappRepository;
import com.eseict.kaist.patrol.data.repository.PatrolRepository;
import com.eseict.kaist.patrol.data.vo.TblPatrol;
import com.eseict.kaist.patrol.data.vo.TblPatrolMapp;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class PatrolService {

    private final PatrolRepository patrolRepository;
    private final PatrolMappRepository patrolMappRepository;
    private final CctvRepository cctvRepository;

    @Transactional
    public Long createPatrol(PatrolRequest request) {
        List<Long> cctvIds = resolveStreamIdsToCctvIds(request.getStreamIds());

        TblPatrol patrol = new TblPatrol();
        patrol.setName(request.getName());
        patrol.setRegisteredAt(OffsetDateTime.now());
        patrolRepository.save(patrol);

        List<TblPatrolMapp> mappings = toPatrolMapps(patrol.getId(), cctvIds);
        patrolMappRepository.saveAll(mappings);

        return patrol.getId();
    }

    @Transactional
    public Long updatePatrol(Long id, PatrolRequest request) {
        List<Long> cctvIds = resolveStreamIdsToCctvIds(request.getStreamIds());

        TblPatrol patrol = patrolRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Patrol not found. id=" + id));
        patrol.setName(request.getName());

        patrolMappRepository.deleteByPatrolId(id);
        List<TblPatrolMapp> mappings = toPatrolMapps(id, cctvIds);
        patrolMappRepository.saveAll(mappings);

        return id;
    }

    @Transactional
    public void deletePatrol(Long id) {
        patrolMappRepository.deleteByPatrolId(id);
        patrolRepository.deleteById(id);
    }

    /**
     * streamId 목록을 cctv_id(bigint PK)로 변환
     */
    private List<Long> resolveStreamIdsToCctvIds(List<String> streamIds) {
        if (streamIds == null || streamIds.isEmpty()) {
            throw new IllegalArgumentException("streamIds is empty");
        }
        return streamIds.stream()
                .distinct()
                .map(streamId -> cctvRepository.findByStreamId(streamId)
                        .orElseThrow(() -> new IllegalArgumentException("CCTV not found: " + streamId)))
                .map(TblCctv::getCctvId)
                .toList();
    }

    private List<TblPatrolMapp> toPatrolMapps(Long patrolId, List<Long> cctvIds) {
        return cctvIds.stream()
                .map(cctvId -> new TblPatrolMapp(null, patrolId, cctvId))
                .toList();
    }
}
