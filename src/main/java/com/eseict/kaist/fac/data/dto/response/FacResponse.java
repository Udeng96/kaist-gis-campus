package com.eseict.kaist.fac.data.dto.response;

import com.eseict.kaist.fac.data.dto.BuildingDto;
import com.eseict.kaist.fac.data.dto.CctvDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FacResponse {

    CctvDto cctv;
    BuildingDto building;

}
