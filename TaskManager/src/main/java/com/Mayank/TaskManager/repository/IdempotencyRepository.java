package com.Mayank.TaskManager.repository;

import com.Mayank.TaskManager.model.IdempotencyRecord;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface IdempotencyRepository extends MongoRepository<IdempotencyRecord, String> {
    Optional<IdempotencyRecord> findByIdempotencyKey(String idempotencyKey);
    void deleteByExpiresAtBefore(LocalDateTime cutoff);
}
