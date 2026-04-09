package com.eseict.kaist.common.controller;


import com.eseict.kaist.common.data.dto.MetaDto;
import com.eseict.kaist.common.service.CommonService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static com.eseict.kaist.config.ApiConstant.API_PRODUCES;

@RestController
@RequestMapping(value = "/common", produces = API_PRODUCES)
@Slf4j
@RequiredArgsConstructor
public class CommonController {

    private final CommonService commonService;

    @GetMapping("/types")
    public ResponseEntity<List<MetaDto>> getTypes(){
        return ResponseEntity.ok(commonService.getMetaList());
    }
}
