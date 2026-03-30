package com.demo.prompt_injection.constant.enums;

import lombok.Getter;

public enum Severity {
    TBD(-1),
    LOW(4),
    MEDIUM(3),
    HIGH(2),
    HIGHEST(1);

    @Getter
    private final int priority;

    Severity(int priority) {
        this.priority = priority;
    }
}
