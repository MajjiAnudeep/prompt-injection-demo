package com.demo.prompt_injection.model;

import com.demo.prompt_injection.constant.enums.Severity;
import com.demo.prompt_injection.constant.enums.Team;

import java.util.UUID;

public record BugTriageResponse(
        UUID bugUuid,
        String reporterName,
        String bugDescription,
        Severity severity,
        Team assignedBlame,
        String rawAiResponse
) {
}
