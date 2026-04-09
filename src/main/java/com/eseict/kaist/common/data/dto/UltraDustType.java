package com.eseict.kaist.common.data.dto;

import java.util.Arrays;

public enum UltraDustType {
    GOOD(15, "좋음", "good"),
    NORMAL(35, "보통", "normal"),
    BAD(75 ,"나쁨","bad"),
    VERY_BAD(100, "매우나쁨","vbad");

    private final Integer value;
    private final String name;
    private final String key;

    UltraDustType(Integer value, String name, String key) {
        this.value = value;
        this.name = name;
        this.key = key;
    }

    public static UltraDustType fromValue(Integer value) {
        return Arrays.stream(values())
                .filter(v -> v.value>=value)
                .findFirst()
                .orElse(NORMAL);
    }

    public static UltraDustType fromName(String name) {
        return Arrays.stream(values())
                .filter(v -> v.name.equals(name))
                .findFirst()
                .orElse(NORMAL);
    }

    public static String nameOf(Integer value) {
        UltraDustType v = fromValue(value);
        return v.name;
    }

    public static String keyOf(String name) {
        UltraDustType v = fromName(name);
        return v.key;
    }
}
