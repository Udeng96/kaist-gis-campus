package com.eseict.kaist.common.data.dto;

import java.util.Arrays;

public enum DustType {
    GOOD(30, "좋음", "good"),
    NORMAL(80, "보통", "normal"),
    BAD(150 ,"나쁨", "bad"),
    VERY_BAD(300, "매우나쁨", "vbad");

    private final Integer value;
    private final String name;
    private final String key;

    DustType(Integer value,String name, String key) {
        this.value = value;
        this.name = name;
        this.key = key;
    }

    public static DustType fromValue(Integer value) {
        return Arrays.stream(values())
                .filter(v -> v.value>=value)
                .findFirst()
                .orElse(NORMAL);
    }

    public static DustType fromName(String name) {
        return Arrays.stream(values())
                .filter(v -> v.name.equals(name))
                .findFirst()
                .orElse(NORMAL);
    }

    public static String nameOf(Integer value) {
        DustType v = fromValue(value);
        return v.name;
    }

    public static String keyOf(String name) {
        DustType v = fromName(name);
        return v.key;
    }
}
