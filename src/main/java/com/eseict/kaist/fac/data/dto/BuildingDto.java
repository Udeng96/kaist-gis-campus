package com.eseict.kaist.fac.data.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BuildingDto {

    @NotNull
    private int totalCnt;
    @NotNull
    private int totalPage;
    @NotNull
    private int cnt;
    @NotNull
    private int page;
    @NotNull
    private List<BuildingItemDto> buildingItems;
}
