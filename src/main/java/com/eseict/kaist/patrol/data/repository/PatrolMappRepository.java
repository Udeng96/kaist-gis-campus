package com.eseict.kaist.patrol.data.repository;

import com.eseict.kaist.patrol.data.vo.TblPatrolMapp;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PatrolMappRepository extends JpaRepository<TblPatrolMapp, Long> {

    List<TblPatrolMapp> findByPatrolId(Long patrolId);

    boolean existsByPatrolId(Long patrolId);

    void deleteByPatrolId(Long patrolId);
}
