package com.eseict.kaist.fac.data.repository;

import com.eseict.kaist.fac.data.vo.TblFire;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FireSensorRepository extends JpaRepository<TblFire, Long> {
}
