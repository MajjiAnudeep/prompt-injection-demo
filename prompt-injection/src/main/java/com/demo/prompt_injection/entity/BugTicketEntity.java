package com.demo.prompt_injection.entity;

import com.demo.prompt_injection.constant.enums.Severity;
import com.demo.prompt_injection.constant.enums.Team;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

import static com.demo.prompt_injection.constant.PromptInjectionConstants.MAX_DESCRIPTION_LENGTH;

@Data
@NoArgsConstructor
@Table
@Entity(name = "bug_ticket")
public class BugTicketEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "bug_uuid")
    private UUID bugUuid;

    @Column(name = "reporter_name")
    private String reporterName;

    @Column(name = "bug_description", length = MAX_DESCRIPTION_LENGTH)
    private String bugDescription;

    @Enumerated(EnumType.STRING)
    @Column(name = "ai_severity")
    @ColumnDefault("'TBD'")
    private Severity severity;

    @Enumerated(EnumType.STRING)
    @Column(name = "ai_assigned_blame")
    @ColumnDefault("'TBD'")
    private Team assignedBlame;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
}
