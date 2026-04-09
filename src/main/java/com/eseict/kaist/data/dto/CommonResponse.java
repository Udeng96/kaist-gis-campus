package com.eseict.kaist.data.dto;

public enum CommonResponse {

    SUCCESS_RESPONSE(200, "SUCCESS"),
    FAILURE_RESPONSE(400, "FAILURE");

    private final int code;
    private final String message;

    CommonResponse(int code, String message) {
        this.code = code;
        this.message = message;
    }

    public int getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }

    public static CommonResponse fromCode(int code) {
        if (code == 200) return SUCCESS_RESPONSE;
        return FAILURE_RESPONSE;
    }
}
