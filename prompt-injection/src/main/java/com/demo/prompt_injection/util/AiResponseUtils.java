package com.demo.prompt_injection.util;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

// [CHANGED] Extracted from PromptInjectionConstants — runtime behavior doesn't belong in a constants class
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class AiResponseUtils {

    /**
     * Strips markdown code fences (e.g., ```json ... ```) from raw AI responses.
     */
    public static String cleanAiResponse(String rawAiResponse) {
        String cleaned = rawAiResponse.trim();
        if (cleaned.startsWith("```")) {
            cleaned = cleaned.replaceAll("^```[a-zA-Z]*\\n?", "").replaceAll("```$", "").trim();
        }
        return cleaned;
    }

}
