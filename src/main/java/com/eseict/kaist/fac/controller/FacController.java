package com.eseict.kaist.fac.controller;

import com.eseict.kaist.fac.data.dto.CctvDto;
import com.eseict.kaist.fac.data.dto.SensorDto;
import com.eseict.kaist.fac.data.dto.request.CreateCctvRequest;
import com.eseict.kaist.fac.data.dto.response.FacResponse;
import com.eseict.kaist.fac.service.command.CctvService;
import com.eseict.kaist.fac.service.query.BuildingQueryService;
import com.eseict.kaist.fac.service.query.CctvQueryService;
import com.eseict.kaist.fac.service.query.SensorQueryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.eseict.kaist.config.ApiConstant.API_PRODUCES;


@RestController
@RequestMapping(value = "/fac", produces = API_PRODUCES)
@Slf4j
@RequiredArgsConstructor
public class FacController {

    private final SensorQueryService sensorQueryService;
    private final CctvQueryService cctvQueryService;
    private final BuildingQueryService buildingService;
    private final CctvService cctvService;

    @GetMapping("")
    public ResponseEntity<FacResponse> getFacilities(@RequestParam(value = "isFavoriteMod", defaultValue = "false") boolean isFavoriteMod){
        return ResponseEntity.ok(new FacResponse(cctvQueryService.getCctvs("ALL",0 , isFavoriteMod), buildingService.getBuildings(isFavoriteMod)));
    }

    @GetMapping("/cctv/{building}/{page}")
    public ResponseEntity<CctvDto> getCctvsByBuilding(@PathVariable String building,
                                                      @PathVariable Integer page,
                                                      @RequestParam(value = "isFavoriteMod", defaultValue = "false") boolean isFavoriteMod){
        return ResponseEntity.ok(cctvQueryService.getCctvs(building,page,isFavoriteMod));
    }

    @PostMapping("/cctv")
    public ResponseEntity<String> createCctv(@Valid @RequestBody CreateCctvRequest createCctvRequest){
        return ResponseEntity.ok(cctvService.createCctv(createCctvRequest));
    }

    @PutMapping("/cctv/{streamId}")
    public ResponseEntity<String> updateCctv(@Valid @RequestBody CreateCctvRequest createCctvRequest, @PathVariable String streamId){
        return ResponseEntity.ok(cctvService.updateCctv(createCctvRequest, streamId));
    }

    @DeleteMapping("/cctv/{streamId}")
    public ResponseEntity<String> deleteCctv(@PathVariable String streamId){
        cctvService.deleteCctv(streamId);
        return ResponseEntity.ok(streamId);
    }

    @GetMapping("/sensors")
    public ResponseEntity<List<SensorDto>> getSensors(){
        return ResponseEntity.ok(sensorQueryService.getAllSensors());
    }

    @PutMapping("/favorite/building/{code}")
    public ResponseEntity<Void> toggleBuildingFavorite(@PathVariable String code) {
        buildingService.toggleFavorite(code);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/favorite/cctv/{streamId}")
    public ResponseEntity<Void> toggleCctvFavorite(@PathVariable String streamId) {
        cctvService.toggleFavorite(streamId);
        return ResponseEntity.ok().build();
    }
}
