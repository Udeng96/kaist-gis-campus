package com.eseict.kaist.event.data.repository.log;

import com.eseict.kaist.event.data.vo.log.TblFireLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FireRepository extends JpaRepository<TblFireLog, Long> {
    Optional<TblFireLog> findByEventId(Long eventId);
}
