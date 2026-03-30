package com.demo.prompt_injection.model;

import jakarta.validation.constraints.Size;

public record ChatMessageRequest(
        @Size(max = 500, message = "Chat message exceeds maximum length of 500 characters.")
        String chatMessage,
        String sessionId
) {
}
