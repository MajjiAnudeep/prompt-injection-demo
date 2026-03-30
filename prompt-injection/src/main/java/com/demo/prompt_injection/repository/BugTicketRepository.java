package com.demo.prompt_injection.repository;

import com.demo.prompt_injection.entity.BugTicketEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface BugTicketRepository extends JpaRepository<BugTicketEntity, UUID> {
}
