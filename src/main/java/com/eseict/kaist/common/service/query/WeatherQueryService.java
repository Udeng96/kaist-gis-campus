package com.eseict.kaist.common.service.query;

import com.eseict.kaist.common.data.WeatherRepository;
import com.eseict.kaist.common.data.dto.DustType;
import com.eseict.kaist.common.data.dto.UltraDustType;
import com.eseict.kaist.common.data.dto.WeatherDto;
import com.eseict.kaist.common.data.vo.TblWeather;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class WeatherQueryService {

    private final WeatherRepository weatherRepository;

    public WeatherDto getWeatherInfo(){
        TblWeather weatherInfo = weatherRepository.findTopByOrderByRegDtmDesc().orElse(null);

        if(weatherInfo== null){
            return null;
        }

        return parseWeatherInfo(weatherInfo);

    }

    public WeatherDto parseWeatherInfo(TblWeather weatherInfo){
        String skyIcon = ! weatherInfo.getPtyCd().equals("0") ? weatherInfo.getSkyCd() : weatherInfo.getPtyCd();
        String skyNm = ! weatherInfo.getPtyCd().equals("0") ? weatherInfo.getSky() : weatherInfo.getPty();
        String ultraDustIcon = UltraDustType.keyOf(weatherInfo.getUltraDust());
        String ultraDustNm =weatherInfo.getUltraDust();
        String dustIcon = DustType.keyOf(weatherInfo.getDust());
        String dustNm = weatherInfo.getDust();
        String temp = weatherInfo.getTemp();
        String report = weatherInfo.getReportContent();

        return new WeatherDto(skyIcon, skyNm, ultraDustIcon, ultraDustNm, dustIcon, dustNm, temp, report);
    }

}
