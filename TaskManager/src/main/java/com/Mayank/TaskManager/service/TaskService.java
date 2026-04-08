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

    public List<Task> findAll() {
        return taskRepository.findAll();
    }

    public Task findById(String id) {
        Optional<Task> task = taskRepository.findById(id);
        return task.orElse(null);
    }

    public Task create(Task task) {
        return taskRepository.save(task);
    }

    public Task update(String id, Task taskDetails) {
        Task task = findById(id);
        if (task != null) {
            task.setTitle(taskDetails.getTitle());
            task.setDescription(taskDetails.getDescription());
            task.setDueDate(taskDetails.getDueDate());
            task.setCompleted(taskDetails.isCompleted());
            return taskRepository.save(task);
        }
        return null;
    }

    public void delete(String id) {
        taskRepository.deleteById(id);
    }
}
