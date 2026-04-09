package com.eseict.kaist.event.data.repository.log;

import com.eseict.kaist.event.data.vo.log.TblFlameLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FlameRepository extends JpaRepository<TblFlameLog, Long> {
    Optional<TblFlameLog> findByEventId(Long eventId);
}
