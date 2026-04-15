package com.Mayank.TaskManager.controller;

import com.Mayank.TaskManager.model.Task;
import com.Mayank.TaskManager.repository.TaskRepository;
import com.Mayank.TaskManager.security.UserDetailsImpl;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskRepository taskRepository;

    @GetMapping
    public ResponseEntity<Page<Task>> getAllTasks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Task> tasks = taskRepository.findAll(pageable);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Task> getTask(@PathVariable String id) {
        return taskRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PostMapping
    public ResponseEntity<?> createTask(@RequestBody Task task) {
        try {
            System.out.println("Incoming task: " + task);

            task.setApprovalStatus("PENDING");

            Task saved = taskRepository.save(task);

            return ResponseEntity.ok(saved);

        } catch (Exception e) {
            e.printStackTrace(); // 🔥 VERY IMPORTANT
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTask(
            @PathVariable String id,
            @RequestBody Task updatedTask) {

        try {
            System.out.println("PUT called for ID: " + id);

            Task existing = taskRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Task not found"));

            existing.setTitle(updatedTask.getTitle());
            existing.setDescription(updatedTask.getDescription());
            existing.setStatus(updatedTask.getStatus());

            // 🔥 maker-checker rule
            existing.setApprovalStatus("PENDING");

            Task saved = taskRepository.save(existing);

            return ResponseEntity.ok(saved);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable String id) {
        try {
            Task existing = taskRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Task not found"));

            existing.setStatus("DELETED");
            existing.setApprovalStatus("PENDING");

            taskRepository.save(existing);

            return ResponseEntity.ok("Deleted");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }
}
