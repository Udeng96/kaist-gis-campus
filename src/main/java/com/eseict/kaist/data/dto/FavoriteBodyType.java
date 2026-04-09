package com.eseict.kaist.data.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FavoriteBodyType {
    private String favorites;
    private String buildFavorites;
}
