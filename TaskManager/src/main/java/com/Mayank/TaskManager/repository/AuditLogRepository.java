package com.Mayank.TaskManager.repository;

import com.Mayank.TaskManager.model.AuditLog;
import com.Mayank.TaskManager.model.TaskOperation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AuditLogRepository extends MongoRepository<AuditLog, String> {
    List<AuditLog> findByTaskIdOrderByTimestampDesc(String taskId);
    List<AuditLog> findByUserIdOrderByTimestampDesc(String userId);
    List<AuditLog> findByOperationAndTimestampAfter(TaskOperation operation, LocalDateTime since);
}
