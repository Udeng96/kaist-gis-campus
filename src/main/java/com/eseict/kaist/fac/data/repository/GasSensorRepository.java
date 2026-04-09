package com.eseict.kaist.fac.data.repository;

import com.eseict.kaist.fac.data.vo.TblGas;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GasSensorRepository extends JpaRepository<TblGas, Long> {
}
