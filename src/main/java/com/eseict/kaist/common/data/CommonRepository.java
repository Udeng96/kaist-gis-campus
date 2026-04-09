package com.eseict.kaist.common.data;

import com.eseict.kaist.common.data.vo.CommCode;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommonRepository extends JpaRepository<CommCode, String> {
}
