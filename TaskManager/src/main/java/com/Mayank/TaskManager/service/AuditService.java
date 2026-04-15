package com.Mayank.TaskManager.service;

import com.Mayank.TaskManager.model.AuditLog;
import com.Mayank.TaskManager.model.ApprovalStatus;
import com.Mayank.TaskManager.model.TaskOperation;
import com.Mayank.TaskManager.repository.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AuditService {

    @Autowired
    private AuditLogRepository auditLogRepository;

    public void log(String taskId, String userId, TaskOperation operation, ApprovalStatus approvalStatus, String transactionId, String details) {
        AuditLog audit = new AuditLog(taskId, userId, operation, approvalStatus, transactionId, details);
        auditLogRepository.save(audit);
    }

    public List<AuditLog> getAuditForTask(String taskId) {
        return auditLogRepository.findByTaskIdOrderByTimestampDesc(taskId);
    }

    public List<AuditLog> getAuditForUser(String userId) {
        return auditLogRepository.findByUserIdOrderByTimestampDesc(userId);
    }

    public void cleanupOldRecords() {
        // Optional: implement cleanup manually if needed
    }
}
