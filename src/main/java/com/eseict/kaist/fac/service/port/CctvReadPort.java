package com.eseict.kaist.fac.service.port;

import com.eseict.kaist.fac.data.dto.CctvItemDto;

public interface CctvReadPort {
    CctvItemDto getCctv(String streamId);
}
