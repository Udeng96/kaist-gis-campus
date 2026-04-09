package com.eseict.kaist.common.data.dto;

import com.eseict.kaist.common.data.vo.CommCode;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class MetaDto {

    private String code;
    private String name;
    private String type;

    public static MetaDto from(CommCode vo) {
        MetaDto dto = new MetaDto();
        dto.setCode(vo.getCode());
        dto.setName(vo.getName());
        dto.setType(vo.getType());
        return dto;
    }

}
