package com.Mayank.TaskManager.service;

import com.Mayank.TaskManager.model.IdempotencyRecord;
import com.Mayank.TaskManager.repository.IdempotencyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class IdempotencyService {

    @Autowired
    private IdempotencyRepository idempotencyRepository;

    private static final long TTL_HOURS = 24;

    public Optional<IdempotencyRecord> getRecord(String key) {
        return idempotencyRepository.findByIdempotencyKey(key);
    }

    public String generateKey() {
        return UUID.randomUUID().toString();
    }

    public void saveRecord(String key, String userId, String responseHash) {
        LocalDateTime expiresAt = LocalDateTime.now().plusHours(TTL_HOURS);
        IdempotencyRecord record = new IdempotencyRecord(key, userId, responseHash, expiresAt);
        idempotencyRepository.save(record);
    }

    public boolean isExpired(IdempotencyRecord record) {
        return LocalDateTime.now().isAfter(record.getExpiresAt());
    }

    public void cleanupExpired() {
        LocalDateTime cutoff = LocalDateTime.now();
        idempotencyRepository.deleteByExpiresAtBefore(cutoff);
    }
}
