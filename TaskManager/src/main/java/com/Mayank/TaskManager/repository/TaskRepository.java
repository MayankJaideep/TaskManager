package com.Mayank.TaskManager.repository;

import com.Mayank.TaskManager.model.Task;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface TaskRepository extends MongoRepository<Task, String> {
    Page<Task> findByUserId(String userId, Pageable pageable);
    Page<Task> findByUserIdAndStatusNot(String userId, String status, Pageable pageable);
    Page<Task> findByStatusNot(String status, Pageable pageable);
}
