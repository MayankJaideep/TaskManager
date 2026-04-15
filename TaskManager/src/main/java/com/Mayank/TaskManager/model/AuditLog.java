package com.Mayank.TaskManager.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;

@Document(collection = "auditLogs")
public class AuditLog {
    @Id
    private String id;

    @Indexed
    private String taskId;

    @Indexed
    private String userId;

    private TaskOperation operation;

    private ApprovalStatus approvalStatus;

    private String transactionId;

    private String details;

    private LocalDateTime timestamp;

    public AuditLog() {}

    public AuditLog(String taskId, String userId, TaskOperation operation, ApprovalStatus approvalStatus, String transactionId, String details) {
        this.taskId = taskId;
        this.userId = userId;
        this.operation = operation;
        this.approvalStatus = approvalStatus;
        this.transactionId = transactionId;
        this.details = details;
        this.timestamp = LocalDateTime.now();
    }

    // Getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTaskId() { return taskId; }
    public void setTaskId(String taskId) { this.taskId = taskId; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public TaskOperation getOperation() { return operation; }
    public void setOperation(TaskOperation operation) { this.operation = operation; }

    public ApprovalStatus getApprovalStatus() { return approvalStatus; }
    public void setApprovalStatus(ApprovalStatus approvalStatus) { this.approvalStatus = approvalStatus; }

    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }

    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
