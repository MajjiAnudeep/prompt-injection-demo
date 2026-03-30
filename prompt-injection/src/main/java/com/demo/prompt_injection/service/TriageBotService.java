package com.demo.prompt_injection.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.demo.prompt_injection.constant.enums.Severity;
import com.demo.prompt_injection.constant.enums.Team;
import com.demo.prompt_injection.entity.BugTicketEntity;
import com.demo.prompt_injection.model.BugSubmissionRequest;
import com.demo.prompt_injection.model.BugTriageResponse;
import com.demo.prompt_injection.repository.BugTicketRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import static com.demo.prompt_injection.util.AiResponseUtils.cleanAiResponse;

@Log4j2
@Service
@RequiredArgsConstructor
public class TriageBotService {

    @Qualifier("vulnerableTriageClient")
    private final ChatClient chatClient;
    private final BugTicketRepository bugTicketRepository;
    private final ObjectMapper objectMapper;

    public BugTriageResponse triageBug(BugSubmissionRequest request) {
        String aiPrompt = "Analyze this bug report and triage it:\n\n" + request.bugDescription();
        String rawAiResponse = generateAiResponse(aiPrompt, request);

        // Parse the AI response
        Severity severity = Severity.TBD;
        Team assignedBlame = Team.TBD;

        try {
            String cleaned = cleanAiResponse(rawAiResponse);
            JsonNode jsonNode = objectMapper.readTree(cleaned);
            severity = extractSeverityData(jsonNode);
            assignedBlame = extractTeamData(jsonNode);
        } catch (Exception e) {
            log.warn("[reporter={}] Failed to parse AI response, using defaults. Error: {}",
                    request.reporterName(), e.getMessage());
        }

        // Save to database
        BugTicketEntity entity = new BugTicketEntity();
        entity.setReporterName(request.reporterName());
        entity.setBugDescription(request.bugDescription());
        entity.setSeverity(severity);
        entity.setAssignedBlame(assignedBlame);

        BugTicketEntity saved = bugTicketRepository.save(entity);
        log.info("[reporter={}] Bug ticket saved: uuid={}, severity={}, blame={}",
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

    private String generateAiResponse(String aiPrompt, BugSubmissionRequest request) {
        log.info("[reporter={}] Submitting bug for triage: {}", request.reporterName(), request.bugDescription());
        String rawAiResponse = chatClient.prompt().user(aiPrompt).call().content();
        log.info("[reporter={}] Raw AI response: {}", request.reporterName(), rawAiResponse);

        return rawAiResponse;
    }

    private Severity extractSeverityData(JsonNode jsonNode) {
        if (jsonNode.has("severity")) {
            return Severity.valueOf(jsonNode.get("severity").asText());
        }
        return Severity.TBD;
    }

    private Team extractTeamData(JsonNode jsonNode) {
        if (jsonNode.has("assignedBlame")) {
            return Team.valueOf(jsonNode.get("assignedBlame").asText());
        }
        return Team.TBD;
    }

}
