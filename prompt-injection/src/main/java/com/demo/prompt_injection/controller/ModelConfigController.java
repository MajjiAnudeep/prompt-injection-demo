package com.demo.prompt_injection.controller;

import com.google.genai.Client;
import com.google.genai.types.Model;
import com.demo.prompt_injection.config.ModelConfig;
import com.demo.prompt_injection.model.ModelUpdateDto;
import com.demo.prompt_injection.model.StandardResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

import static com.demo.prompt_injection.constant.PromptInjectionConstants.*;

@Log4j2
@RestController
@RequiredArgsConstructor
public class ModelConfigController {

    private final ModelConfig modelConfig;
    private final ChatMemory chatMemory;

    @GetMapping(AVAILABLE_MODELS_URL)
    public ResponseEntity<StandardResponse<List<Model>>> availableModels() {
        List<Model> models = new ArrayList<>();
        try (Client client = new Client()) {
            client.models.list(null).forEach(models::add);
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            throw new RuntimeException(e);
        }
        return ResponseEntity.ok(StandardResponse.ok(models));
    }

    @GetMapping(CURRENT_MODEL_URL)
    public ResponseEntity<StandardResponse<ModelUpdateDto>> getCurrentModel() {
        return ResponseEntity.ok(StandardResponse.ok(
                new ModelUpdateDto(modelConfig.getCurrentModel().get(), modelConfig.getTemperature().get())));
    }

    @PostMapping(UPDATE_MODEL_URL)
    public ResponseEntity<StandardResponse<Void>> updateModel(@RequestBody ModelUpdateDto request) {
        modelConfig.update(request.model(), request.temperature());
        log.info("Model config updated: model={}, temperature={}",
                modelConfig.getCurrentModel(),
                modelConfig.getTemperature());
        return ResponseEntity.ok(StandardResponse.okMessage("Model config updated to: " + modelConfig.getCurrentModel().get()));
    }

    @DeleteMapping(CLEAR_SESSION_URL)
    public ResponseEntity<StandardResponse<Void>> clearSession(@PathVariable String sessionId) {
        chatMemory.clear(sessionId);
        modelConfig.reset();
        log.info("Session cleared and model reset: {}", sessionId);
        return ResponseEntity.ok(StandardResponse.okMessage("Session cleared: " + sessionId));
    }

}
