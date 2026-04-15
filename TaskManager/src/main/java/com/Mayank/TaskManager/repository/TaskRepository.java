package com.Mayank.TaskManager.repository;

import com.Mayank.TaskManager.model.ApprovalStatus;
import com.Mayank.TaskManager.model.Task;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository extends MongoRepository<Task, String> {
    List<Task> findByUserId(String userId);
    List<Task> findByUserIdAndDeletedFalse(String userId);
    List<Task> findByApprovalStatus(ApprovalStatus approvalStatus);
    List<Task> findByApprovalStatusAndDeletedFalse(ApprovalStatus approvalStatus);
    Optional<Task> findByIdAndDeletedFalse(String id);
    Page<Task> findByUserIdAndDeletedFalse(String userId, Pageable pageable);
    Page<Task> findByApprovalStatusAndDeletedFalse(ApprovalStatus approvalStatus, Pageable pageable);
}
