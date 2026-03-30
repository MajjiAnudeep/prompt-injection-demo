package com.demo.prompt_injection.service;

import com.demo.prompt_injection.config.ModelConfig;
import com.demo.prompt_injection.model.ChatMessageRequest;
import io.micrometer.common.util.StringUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.google.genai.GoogleGenAiChatOptions;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import static com.demo.prompt_injection.constant.PromptInjectionConstants.CHAT_INTEGRATION_DEFAULT_PROMPT;
import static com.demo.prompt_injection.constant.PromptInjectionConstants.CHAT_INTEGRATION_DEFAULT_SESSION_ID;

@Log4j2
@Service
@RequiredArgsConstructor
public class ChatIntegrationService {

    @Qualifier("chatIntegrationClient")
    private final ChatClient chatClient;
    private final ModelConfig modelConfig;
    private final ChatMemory chatMemory;

    public String getResponseFromModel(ChatMessageRequest chatMessageRequest) {
        String chatMessage = StringUtils.isEmpty(chatMessageRequest.chatMessage())
                ? CHAT_INTEGRATION_DEFAULT_PROMPT
                : chatMessageRequest.chatMessage();

        String sessionId = StringUtils.isEmpty(chatMessageRequest.sessionId())
                ? CHAT_INTEGRATION_DEFAULT_SESSION_ID
                : chatMessageRequest.sessionId();

        log.debug("[session={}] Prompt: {}", sessionId, chatMessage);
        ChatClient.ChatClientRequestSpec chatClientRequestSpec = chatClient.prompt()
                .user(chatMessage)
                .advisors(MessageChatMemoryAdvisor.builder(chatMemory)
                        .conversationId(sessionId)
                        .build());

        if (modelConfig.isModelUpdated()) {
            chatClientRequestSpec.options(GoogleGenAiChatOptions.builder()
                    .model(modelConfig.getCurrentModel().get())
                    .temperature(modelConfig.getTemperature().get().doubleValue())
                    .build());
        }
        String responseFromModel = chatClientRequestSpec.call().content();
        log.debug("[session={}] Response: {}", sessionId, responseFromModel);
        return responseFromModel;
    }

}
