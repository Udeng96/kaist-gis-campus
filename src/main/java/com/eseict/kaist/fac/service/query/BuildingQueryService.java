package com.eseict.kaist.fac.service.query;

import com.eseict.kaist.fac.data.dto.BuildingDto;
import com.eseict.kaist.fac.data.dto.BuildingItemDto;
import com.eseict.kaist.fac.data.repository.BuildingRepository;
import com.eseict.kaist.fac.data.vo.TblBuilding;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class BuildingQueryService {

    private final BuildingRepository buildingRepository;

    @Transactional
    public void toggleFavorite(String code) {
        TblBuilding building = buildingRepository.findByCode(code)
                .orElseThrow(() -> new IllegalArgumentException("건물을 찾을 수 없습니다: " + code));
        building.setIsFavorite(!Boolean.TRUE.equals(building.getIsFavorite()));
    }

    public BuildingDto getBuildings(boolean isFavoriteMod) {
        Pageable pageable = PageRequest.of(0, 5000, Sort.by("id").descending());
        Page<TblBuilding> filterBuildings = buildingRepository.findAll(pageable);
        List<TblBuilding> buildings = filterBuildings.getContent();

        if (isFavoriteMod) {
            buildings = buildings.stream().filter(b -> Boolean.TRUE.equals(b.getIsFavorite())).toList();
        }

        List<BuildingItemDto> items = buildings.stream().map(BuildingItemDto::convertBuilding).toList();
        return new BuildingDto((int) filterBuildings.getTotalElements(), filterBuildings.getTotalPages(), items.size(), filterBuildings.getPageable().getPageNumber(), items);
    }
}
