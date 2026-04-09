package com.eseict.kaist.common.data.dto;

import java.util.Arrays;

public enum SkyType {

    SUN("1","맑음", "sun"),
    SUN_CLOUD("3","흐림", "sun-cloud"),
    CLOUD("4","구름많음", "cloud");

    private final String code;
    private final String name;
    private final String key;

    SkyType(String code,String name, String key) {
        this.code = code;
        this.name = name;
        this.key = key;
    }

    public String getCode() {
        return code;
    }

    public String getName() {
        return name;
    }

    public String getKey() {
        return key;
    }

    public static SkyType fromCode(String code) {
        if (code == null) return null;
        return Arrays.stream(values())
                .filter(v -> v.code.equals(code))
                .findFirst()
                .orElse(null);
    }

    public static String nameOf(String code) {
        SkyType v = fromCode(code);
        return v == null ? "없음" : v.getName();
    }

    public static String keyOf(String code) {
        SkyType v = fromCode(code);
        return v == null ? "none" : v.getKey();
    }

}
