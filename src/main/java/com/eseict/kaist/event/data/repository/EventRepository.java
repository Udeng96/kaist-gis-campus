package com.eseict.kaist.event.data.repository;

import com.eseict.kaist.event.data.vo.TblHist;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.OffsetDateTime;

public interface EventRepository extends JpaRepository<TblHist, Long> {

    Page<TblHist> findByOccurredAtBetween(OffsetDateTime start, OffsetDateTime end, Pageable pageable);

    Page<TblHist> findByOccurredAtBetweenAndType(OffsetDateTime start, OffsetDateTime end, String type, Pageable pageable);

    Page<TblHist> findByOccurredAtBetweenAndBuildingId(OffsetDateTime start, OffsetDateTime end, Long buildingId, Pageable pageable);

    Page<TblHist> findByOccurredAtBetweenAndTypeAndBuildingId(OffsetDateTime start, OffsetDateTime end, String type, Long buildingId, Pageable pageable);

    // dev 모드용: 날짜 제한 없이 조회
    Page<TblHist> findAll(Pageable pageable);
}
