package com.demo.prompt_injection.config;

import lombok.Getter;
import org.springframework.stereotype.Component;

import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicReference;

import static com.demo.prompt_injection.constant.PromptInjectionConstants.*;

@Getter
@Component
public class ModelConfig {

    private final AtomicReference<String> currentModel = new AtomicReference<>(DEFAULT_AI_MODEL);
    private final AtomicReference<Float> temperature = new AtomicReference<>(DEFAULT_TEMPERATURE);

    private final AtomicBoolean modelUpdated = new AtomicBoolean(false);

    public boolean isModelUpdated() {
        return modelUpdated.get();
    }

    public void update(String model, Float temperature) {
        if (model != null) this.currentModel.set(model);
        if (temperature != null) this.temperature.set(temperature);
        this.modelUpdated.set(true);
    }

    public void reset() {
        modelUpdated.set(false);
        currentModel.set(DEFAULT_AI_MODEL);
        temperature.set(DEFAULT_TEMPERATURE);
    }

}
