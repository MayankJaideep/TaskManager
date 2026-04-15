package com.Mayank.TaskManager.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;

@Document(collection = "idempotencyRecords")
public class IdempotencyRecord {
    @Id
    private String id;

    @Indexed(unique = true)
    private String idempotencyKey;

    @Indexed
    private String userId;

    private String responseHash;

    private LocalDateTime createdAt;

    private LocalDateTime expiresAt;

    public IdempotencyRecord() {}

    public IdempotencyRecord(String idempotencyKey, String userId, String responseHash, LocalDateTime expiresAt) {
        this.idempotencyKey = idempotencyKey;
        this.userId = userId;
        this.responseHash = responseHash;
        this.createdAt = LocalDateTime.now();
        this.expiresAt = expiresAt;
    }

    // Getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getIdempotencyKey() { return idempotencyKey; }
    public void setIdempotencyKey(String idempotencyKey) { this.idempotencyKey = idempotencyKey; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getResponseHash() { return responseHash; }
    public void setResponseHash(String responseHash) { this.responseHash = responseHash; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getExpiresAt() { return expiresAt; }
    public void setExpiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; }
}
