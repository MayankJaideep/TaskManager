package com.Mayank.TaskManager.service;

import com.Mayank.TaskManager.model.Task;
import com.Mayank.TaskManager.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    public List<Task> findAllByUserId(String userId) {
        return taskRepository.findByUserId(userId);
    }

    public Task findByIdAndUserId(String id, String userId) {
        Optional<Task> task = taskRepository.findById(id);
        if (task.isPresent() && task.get().getUserId().equals(userId)) {
            return task.get();
        }
        return null;
    }

    public Task create(Task task, String userId) {
        task.setUserId(userId);
        return taskRepository.save(task);
    }

    public Task update(String id, Task taskDetails, String userId) {
        Task task = findByIdAndUserId(id, userId);
        if (task != null) {
            task.setTitle(taskDetails.getTitle());
            task.setDescription(taskDetails.getDescription());
            task.setDueDate(taskDetails.getDueDate());
            task.setCompleted(taskDetails.isCompleted());
            return taskRepository.save(task);
        }
        return null;
    }

    public void delete(String id, String userId) {
        Task task = findByIdAndUserId(id, userId);
        if (task != null) {
            taskRepository.deleteById(id);
        }
    }
}
