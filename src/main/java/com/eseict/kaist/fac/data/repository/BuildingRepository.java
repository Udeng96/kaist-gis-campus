package com.eseict.kaist.fac.data.repository;

import com.eseict.kaist.fac.data.vo.TblBuilding;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BuildingRepository extends JpaRepository<TblBuilding, Long> {
    Optional<TblBuilding> findByCode(String code);
}
