package com.demo.prompt_injection.exception;

import org.springframework.lang.NonNull;

public class PromptInjectionRuntimeException extends RuntimeException {
    public PromptInjectionRuntimeException(@NonNull String errorMessage){
        super(errorMessage);
    }
}
