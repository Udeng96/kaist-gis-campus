package com.eseict.kaist.event.data.repository;

import com.eseict.kaist.event.data.vo.GasEvent;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GasEventRepository extends JpaRepository<GasEvent, Long> {
}
