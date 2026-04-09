package com.eseict.kaist.fac.data.dto;

import com.eseict.kaist.fac.data.vo.TblBuilding;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BuildingItemDto {

    private FacDto facInfo;
    private String area;

    public static BuildingItemDto convertBuilding(TblBuilding building) {
        FacDto dto = new FacDto();
        dto.setFacId(building.getCode() != null ? building.getCode() : String.valueOf(building.getId()));
        dto.setFacName(building.getName());
        dto.setXCoord(building.getXCoord() != null ? building.getXCoord().toString() : null);
        dto.setYCoord(building.getYCoord() != null ? building.getYCoord().toString() : null);
        dto.setIsFavorite(Boolean.TRUE.equals(building.getIsFavorite()));
        dto.setFacTypeCd("BUILDING");

        BuildingItemDto buildingDto = new BuildingItemDto();
        buildingDto.setFacInfo(dto);
        buildingDto.setArea(building.getArea() != null ? building.getArea() : "");
        return buildingDto;
    }
}
