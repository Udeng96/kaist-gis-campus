package com.eseict.kaist.common.data;


import com.eseict.kaist.common.data.vo.TblWeather;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface WeatherRepository extends JpaRepository<TblWeather, String> {

    Optional<TblWeather> findTopByOrderByRegDtmDesc();

}
