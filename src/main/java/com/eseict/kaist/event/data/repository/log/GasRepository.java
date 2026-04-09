package com.eseict.kaist.event.data.repository.log;

import com.eseict.kaist.event.data.vo.log.TblGasLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface GasRepository extends JpaRepository<TblGasLog, Long> {
    Optional<TblGasLog> findByGasEventId(Long gasEventId);
}
