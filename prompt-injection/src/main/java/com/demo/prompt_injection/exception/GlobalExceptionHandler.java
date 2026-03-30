package com.demo.prompt_injection.exception;

import com.demo.prompt_injection.model.StandardResponse;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.stream.Collectors;

@Log4j2
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<StandardResponse<Void>> handleValidationException(MethodArgumentNotValidException ex) {
        String errors = ex.getBindingResult().getFieldErrors().stream()
                .map(fe -> fe.getField() + ": " + fe.getDefaultMessage())
                .collect(Collectors.joining("; "));
        log.warn("[VALIDATION] {}", errors);
        return ResponseEntity.badRequest().body(StandardResponse.error(errors));
    }

    @ExceptionHandler(PromptInjectionRuntimeException.class)
    public ResponseEntity<StandardResponse<Void>> handlePromptInjectionException(PromptInjectionRuntimeException ex) {
        log.warn("[GUARDRAIL] {}", ex.getMessage());
        return ResponseEntity.badRequest().body(StandardResponse.error(ex.getMessage()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<StandardResponse<Void>> handleGenericException(Exception ex) {
        log.error("[UNEXPECTED] {}", ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(StandardResponse.error("An unexpected error occurred: " + ex.getMessage()));
    }

}
