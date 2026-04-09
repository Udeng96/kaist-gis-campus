package com.eseict.kaist.common.controller;


import com.eseict.kaist.common.data.dto.WeatherDto;
import com.eseict.kaist.common.service.query.WeatherQueryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static com.eseict.kaist.config.ApiConstant.API_PRODUCES;

@RestController
@RequestMapping(value = "/weather", produces = API_PRODUCES)
@Slf4j
@RequiredArgsConstructor
public class WeatherController {

    private final WeatherQueryService weatherQueryService;

    @GetMapping("")
    public WeatherDto getWeatherInfo(){
        return weatherQueryService.getWeatherInfo();
    }

}
