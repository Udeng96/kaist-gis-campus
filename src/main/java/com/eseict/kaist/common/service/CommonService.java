package com.eseict.kaist.common.service;


import com.eseict.kaist.common.data.CommonRepository;
import com.eseict.kaist.common.data.dto.MetaDto;
import com.eseict.kaist.common.data.vo.CommCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor

public class CommonService {

    private final CommonRepository commonRepository;

    public List<MetaDto> getMetaList(){
        return commonRepository.findAll().stream().map(MetaDto::from).collect(Collectors.toList());
    }
}
