package com.demo.prompt_injection.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class StandardResponse<T> {

    @Builder.Default
    private boolean success = true;

    private String message;
    private T data;

    @Builder.Default
    private Instant timestamp = Instant.now();

    public static <T> StandardResponse<T> ok(T data) {
        return StandardResponse.<T>builder()
                .success(true)
                .data(data)
                .build();
    }

    public static <T> StandardResponse<T> ok(T data, String message) {
        return StandardResponse.<T>builder()
                .success(true)
                .data(data)
                .message(message)
                .build();
    }

    public static StandardResponse<Void> okMessage(String message) {
        return StandardResponse.<Void>builder()
                .success(true)
                .message(message)
                .build();
    }

    public static StandardResponse<Void> error(String message) {
        return StandardResponse.<Void>builder()
                .success(false)
                .message(message)
                .build();
    }

}
