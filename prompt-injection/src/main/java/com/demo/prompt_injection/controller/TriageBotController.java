package com.demo.prompt_injection.controller;

import com.demo.prompt_injection.entity.BugTicketEntity;
import com.demo.prompt_injection.model.BugSubmissionRequest;
import com.demo.prompt_injection.model.BugTriageResponse;
import com.demo.prompt_injection.model.StandardResponse;
import com.demo.prompt_injection.repository.BugTicketRepository;
import com.demo.prompt_injection.service.GuardedTriageBotService;
import com.demo.prompt_injection.service.TriageBotService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

import static com.demo.prompt_injection.constant.PromptInjectionConstants.*;

@Log4j2
@RestController
@RequestMapping(value = BASE_API)
@RequiredArgsConstructor
public class TriageBotController {

    private final TriageBotService triageBotService;
    private final GuardedTriageBotService guardedTriageBotService;
    private final BugTicketRepository bugTicketRepository;

    @GetMapping(ALL_TICKETS_URL)
    public ResponseEntity<StandardResponse<List<BugTicketEntity>>> getAllTickets() {
        return ResponseEntity.ok(StandardResponse.ok(bugTicketRepository.findAll()));
    }

    @GetMapping(TICKET_BY_ID_URL)
    public ResponseEntity<StandardResponse<BugTicketEntity>> getTicketById(@PathVariable UUID bugUuid) {
        return bugTicketRepository.findById(bugUuid)
                .map(ticket -> ResponseEntity.ok(StandardResponse.ok(ticket)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping(TRIAGE_URL)
    public ResponseEntity<StandardResponse<BugTriageResponse>> triageBug(
            @Valid @RequestBody BugSubmissionRequest request) {
        BugTriageResponse response = triageBotService.triageBug(request);
        return ResponseEntity.ok(StandardResponse.ok(response));
    }

    @PostMapping(GUARDED_TRIAGE_URL)
    public ResponseEntity<StandardResponse<BugTriageResponse>> triageBugGuarded(
            @Valid @RequestBody BugSubmissionRequest request) {
        BugTriageResponse response = guardedTriageBotService.triageBug(request);
        return ResponseEntity.ok(StandardResponse.ok(response));
    }

    @DeleteMapping(ALL_TICKETS_URL)
    public ResponseEntity<StandardResponse<Void>> deleteAllTickets() {
        bugTicketRepository.deleteAll();
        return ResponseEntity.ok(StandardResponse.okMessage("All tickets have been deleted"));
    }

    @DeleteMapping(TICKET_BY_ID_URL)
    public ResponseEntity<StandardResponse<Void>> deleteTicketById(@PathVariable UUID bugUuid) {
        bugTicketRepository.deleteById(bugUuid);
        String message = "Ticket with ID %s has been deleted";
        return ResponseEntity.ok(StandardResponse.okMessage(String.format(message, bugUuid)));
    }

}
