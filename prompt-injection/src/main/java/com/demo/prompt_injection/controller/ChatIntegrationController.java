package com.demo.prompt_injection.controller;

import com.demo.prompt_injection.model.ChatMessageRequest;
import com.demo.prompt_injection.model.StandardResponse;
import com.demo.prompt_injection.service.ChatIntegrationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

import static com.demo.prompt_injection.constant.PromptInjectionConstants.BASE_API;
import static com.demo.prompt_injection.constant.PromptInjectionConstants.CHAT_INTEGRATION_URL;

@Log4j2
@RestController
@RequestMapping(value = BASE_API)
@RequiredArgsConstructor
public class ChatIntegrationController {

    private final ChatIntegrationService chatIntegrationService;

    @PostMapping(CHAT_INTEGRATION_URL)
    public ResponseEntity<StandardResponse<String>> sendChatMessage(
            @Valid @RequestBody ChatMessageRequest chatMessageRequest) {
        String responseFromModel = chatIntegrationService.getResponseFromModel(chatMessageRequest);
        return ResponseEntity.ok(StandardResponse.ok(responseFromModel));
    }
}
