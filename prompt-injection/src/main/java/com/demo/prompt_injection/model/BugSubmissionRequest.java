package com.demo.prompt_injection.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import static com.demo.prompt_injection.constant.PromptInjectionConstants.MAX_DESCRIPTION_LENGTH;

public record BugSubmissionRequest(
        @NotBlank(message = "Reporter name is required.")
        String reporterName,

        @NotBlank(message = "Bug description is required.")
        @Size(max = MAX_DESCRIPTION_LENGTH, message = "Bug description exceeds maximum length of 2000 characters.")
        String bugDescription
) {
}
