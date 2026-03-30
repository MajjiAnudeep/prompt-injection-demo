package com.demo.prompt_injection.constant.enums;

import lombok.Getter;

public enum Team {
    BACKEND("Java backend developers"),
    FRONTEND("React JS frontend developers"),
    QA("Automation and Manual testers"),
    PBI("Power BI developers"),
    TBD("To be determined");

    @Getter
    private final String description;

    Team(String description) {
        this.description = description;
    }
}
