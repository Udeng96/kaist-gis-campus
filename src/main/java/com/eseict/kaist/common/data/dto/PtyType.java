package com.eseict.kaist.common.data.dto;

import java.util.Arrays;

public enum PtyType {

    NONE("0", "없음", "none"),
    RAIN("1", "비", "cloud-rain"),
    RAIN_SNOW("2", "비/눈", "rain-snow"),
    SNOW("3", "눈", "cloud-snow"),
    SHOWER("4", "소나기", "shower-rain"),
    DRIZZLE("5", "빗방울", "rain-less"),
    DRIZZLE_SNOWFLURRY("6", "눈/비", "snow-rain"),
    SNOWFLURRY("7", "눈날림", "snow-less");


    private final String code;
    private final String name;
    private final String key;

    PtyType(String code, String name, String key) {
        this.code = code;
        this.name = name;
        this.key = key;
    }

    public String getCode() { return code; }
    public String getName() { return name; }
    public String getKey() { return key; }

    public static PtyType fromCode(String code) {
        if (code == null) return null;
        return Arrays.stream(values())
                .filter(v -> v.code.equals(code))
                .findFirst()
                .orElse(null);
    }

    public static String nameOf(String code) {
        PtyType v = fromCode(code);
        return v == null ? "없음" : v.getName();
    }
    public static String keyOf(String code) {
        PtyType v = fromCode(code);
        return v == null ? "none" : v.getKey();
    }
}
