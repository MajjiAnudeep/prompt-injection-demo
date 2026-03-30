package com.demo.prompt_injection.config;

import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.google.genai.GoogleGenAiChatOptions;
import org.springframework.ai.google.genai.common.GoogleGenAiSafetySetting;
import org.springframework.ai.google.genai.common.GoogleGenAiSafetySetting.HarmBlockThreshold;
import org.springframework.ai.google.genai.common.GoogleGenAiSafetySetting.HarmCategory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

import static com.demo.prompt_injection.constant.PromptInjectionConstants.*;

@Configuration
@RequiredArgsConstructor
public class AIConfiguration {

    private final ModelConfig modelConfig;

    private List<GoogleGenAiSafetySetting> noSafetySettings() {
        return List.of(
                new GoogleGenAiSafetySetting.Builder()
                        .withCategory(HarmCategory.HARM_CATEGORY_HARASSMENT)
                        .withThreshold(HarmBlockThreshold.OFF)
                        .build(),
                new GoogleGenAiSafetySetting.Builder()
                        .withCategory(HarmCategory.HARM_CATEGORY_HATE_SPEECH)
                        .withThreshold(HarmBlockThreshold.OFF)
                        .build(),
                new GoogleGenAiSafetySetting.Builder()
                        .withCategory(HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT)
                        .withThreshold(HarmBlockThreshold.OFF)
                        .build(),
                new GoogleGenAiSafetySetting.Builder()
                        .withCategory(HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT)
                        .withThreshold(HarmBlockThreshold.OFF)
                        .build()
        );
    }

    @Bean
    @Qualifier("chatIntegrationClient")
    public ChatClient chatIntegrationClient(ChatClient.Builder builder) {
        return builder
                .defaultSystem(CHAT_INTEGRATION_SYSTEM_PROMPT)
                .defaultOptions(GoogleGenAiChatOptions.builder()
                        .model(modelConfig.getCurrentModel().get())
                        .temperature(modelConfig.getTemperature().get().doubleValue())
                        .build())
                .build();
    }

    @Bean
    @Qualifier("vulnerableTriageClient")
    public ChatClient vulnerableTriageClient(ChatClient.Builder builder) {
        return builder
                .defaultSystem(TRIAGE_SYSTEM_PROMPT)
                .defaultOptions(GoogleGenAiChatOptions.builder()
                        .model(modelConfig.getCurrentModel().get())
                        .temperature(modelConfig.getTemperature().get().doubleValue())
                        .safetySettings(noSafetySettings())   // <-- safety OFF
                        .build())
                .build();
    }

    @Bean
    @Qualifier("guardedTriageClient")
    public ChatClient guardedTriageClient(ChatClient.Builder builder) {
        return builder
                .defaultSystem(GUARDED_TRIAGE_SYSTEM_PROMPT)
                .defaultOptions(GoogleGenAiChatOptions.builder()
                        .model(modelConfig.getCurrentModel().get())
                        .temperature(modelConfig.getTemperature().get().doubleValue())
                        .safetySettings(noSafetySettings())   // <-- safety OFF
                        .build())
                .build();
    }

}
