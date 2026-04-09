package com.eseict.kaist.patrol.data.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PatrolRequest {

    @NotNull
    private String name;
    @NotEmpty
    private List<String> streamIds;
}
