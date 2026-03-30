package com.demo.prompt_injection.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.demo.prompt_injection.constant.enums.Severity;
import com.demo.prompt_injection.constant.enums.Team;
import com.demo.prompt_injection.entity.BugTicketEntity;
import com.demo.prompt_injection.exception.PromptInjectionRuntimeException;
import com.demo.prompt_injection.model.BugSubmissionRequest;
import com.demo.prompt_injection.model.BugTriageResponse;
import com.demo.prompt_injection.repository.BugTicketRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.regex.Pattern;

import static com.demo.prompt_injection.constant.PromptInjectionConstants.*;
import static com.demo.prompt_injection.util.AiResponseUtils.cleanAiResponse;

@Log4j2
@Service
@RequiredArgsConstructor
public class GuardedTriageBotService {

    @Qualifier("guardedTriageClient")
    private final ChatClient chatClient;
    private final BugTicketRepository bugTicketRepository;
    private final ObjectMapper objectMapper;

    // ──────────────────────────────────────────────────────────────────────
    //  GUARDRAIL 1: Input Sanitization — Suspicious pattern detection
    // ──────────────────────────────────────────────────────────────────────

    /**
     * GUARDRAIL 1: Scans user input for known injection patterns.
     * Returns true if any suspicious pattern is detected.
     */
    private boolean containsSuspiciousPatterns(String input) {
        for (Pattern pattern : SUSPICIOUS_PATTERNS) {
            if (pattern.matcher(input).find()) {
                log.warn("[GUARDRAIL-1: INPUT FILTER] Suspicious pattern detected: {}", pattern.pattern());
                return true;
            }
        }
        return false;
    }

    // ──────────────────────────────────────────────────────────────────────
    //  GUARDRAIL 2: Hardened System Prompt — Instruction reinforcement
    // ──────────────────────────────────────────────────────────────────────

    // The hardened system prompt is defined in PromptInjectionConstants as
    // GUARDED_TRIAGE_SYSTEM_PROMPT. It explicitly warns the model about
    // injection attempts and reinforces that only the JSON output format
    // should be produced regardless of user input content.

    // ──────────────────────────────────────────────────────────────────────
    //  GUARDRAIL 3: Output Validation — Structural + semantic checks
    // ──────────────────────────────────────────────────────────────────────

    /**
     * GUARDRAIL 3a: Validates that the AI response is structurally correct JSON
     * with exactly the expected fields and valid enum values.
     */
    private boolean isValidTriageJson(String cleaned) {
        try {
            JsonNode node = objectMapper.readTree(cleaned);

            // Must have exactly 2 fields
            if (node.size() != 2) {
                log.warn("[GUARDRAIL-3a: OUTPUT VALIDATION] Unexpected field count: {}", node.size());
                return false;
            }

            // Must have 'severity' and 'assignedBlame'
            if (!node.has("severity") || !node.has("assignedBlame")) {
                log.warn("[GUARDRAIL-3a: OUTPUT VALIDATION] Missing required fields");
                return false;
            }

            // Validate severity is a known enum value
            String severity = node.get("severity").asText();
            try {
                Severity.valueOf(severity);
            } catch (IllegalArgumentException e) {
                log.warn("[GUARDRAIL-3a: OUTPUT VALIDATION] Invalid severity value: {}", severity);
                return false;
            }

            // Validate assignedBlame is a known enum value
            String blame = node.get("assignedBlame").asText();
            try {
                Team.valueOf(blame);
            } catch (IllegalArgumentException e) {
                log.warn("[GUARDRAIL-3a: OUTPUT VALIDATION] Invalid assignedBlame value: {}", blame);
                return false;
            }

            return true;
        } catch (Exception e) {
            log.warn("[GUARDRAIL-3a: OUTPUT VALIDATION] JSON parse failed: {}", e.getMessage());
            return false;
        }
    }

    /**
     * GUARDRAIL 3b: Checks if the raw AI response contains extra text beyond
     * the expected JSON (indicating the model may have been manipulated into
     * producing conversational output, explanations, or injected content).
     */
    private boolean containsExtraContent(String cleanedAiResponse) {
        if (!cleanedAiResponse.startsWith("{") || !cleanedAiResponse.endsWith("}")) {
            log.warn("[GUARDRAIL-3b: EXTRA CONTENT] Response is not a clean JSON object");
            return true;
        }
        return false;
    }

    // ──────────────────────────────────────────────────────────────────────
    //  GUARDRAIL 4: Wrapped User Input — Delimiter-based isolation
    // ──────────────────────────────────────────────────────────────────────

    /**
     * Wraps the user's bug description inside clear delimiters so the model
     * can distinguish between system instructions and user-provided content.
     * This is a simple but effective defense that makes it harder for injected
     * instructions to "escape" the user content boundary.
     */
    private String buildSandboxedPrompt(String bugDescription) {
        return SANDBOX_TRIAGE_PROMPT.replace("{{bugDescription}}", bugDescription);
    }

    // ──────────────────────────────────────────────────────────────────────
    //  Main Triage Method — All guardrails applied
    // ──────────────────────────────────────────────────────────────────────

    public BugTriageResponse triageBug(BugSubmissionRequest request) {

        // ── GUARDRAIL 1: Input sanitization ──
        if (containsSuspiciousPatterns(request.bugDescription())) {
            log.warn("[reporter={}] [BLOCKED] Prompt injection attempt detected in input",
                    request.reporterName());

            throw new PromptInjectionRuntimeException(
                    "[BLOCKED BY GUARDRAIL 1 — INPUT FILTER] " +
                            "Suspicious patterns detected in bug description. This report has been flagged for manual review.");
        }

        // ── GUARDRAIL 4: Wrap user input with delimiters ──
        String sandboxedPrompt = buildSandboxedPrompt(request.bugDescription());

        // ── GUARDRAIL 2: Use hardened system prompt ──
        String rawAiResponse = generateGuardedAiResponse(sandboxedPrompt, request);

        // ── GUARDRAIL 3: Output validation ──
        String cleaned = cleanAiResponse(rawAiResponse);

        if (containsExtraContent(cleaned)) {
            log.warn("[reporter={}] [FLAGGED] AI response contained unexpected extra content",
                    request.reporterName());
        }

        if (!isValidTriageJson(cleaned)) {
            log.warn("[reporter={}] [FLAGGED] AI response failed structural validation",
                    request.reporterName());

            throw new PromptInjectionRuntimeException(
                    "[FLAGGED BY GUARDRAIL 3 — OUTPUT VALIDATION] " +
                            "AI response did not match expected format. Raw: " + rawAiResponse);
        }

        // All guardrails passed — parse normally
        Severity severity = Severity.TBD;
        Team assignedBlame = Team.TBD;

        try {
            JsonNode jsonNode = objectMapper.readTree(cleaned);
            severity = Severity.valueOf(jsonNode.get("severity").asText());
            assignedBlame = Team.valueOf(jsonNode.get("assignedBlame").asText());
        } catch (Exception e) {
            log.warn("[reporter={}] Failed to parse validated AI response: {}",
                    request.reporterName(), e.getMessage());
        }

        BugTicketEntity entity = new BugTicketEntity();
        entity.setReporterName(request.reporterName());
        entity.setBugDescription(request.bugDescription());
        entity.setSeverity(severity);
        entity.setAssignedBlame(assignedBlame);
        BugTicketEntity saved = bugTicketRepository.save(entity);

        log.info("[reporter={}] [GUARDED] Bug ticket saved: uuid={}, severity={}, blame={}",
                request.reporterName(), saved.getBugUuid(), severity, assignedBlame);

        return new BugTriageResponse(
                saved.getBugUuid(),
                saved.getReporterName(),
                saved.getBugDescription(),
                saved.getSeverity(),
                saved.getAssignedBlame(),
                rawAiResponse
        );
    }

    private String generateGuardedAiResponse(String aiPrompt, BugSubmissionRequest request) {
        log.info("[reporter={}] [GUARDED] Submitting bug for triage", request.reporterName());
        String rawAiResponse = chatClient.prompt().user(aiPrompt).call().content();
        log.info("[reporter={}] [GUARDED] Raw AI response: {}", request.reporterName(), rawAiResponse);

        return rawAiResponse;
    }

}
