package com.eseict.kaist.patrol.data.repository;

import com.eseict.kaist.patrol.data.vo.TblPatrol;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PatrolRepository extends JpaRepository<TblPatrol, Long> {
}
