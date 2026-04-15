package com.Mayank.TaskManager.controller;

import com.Mayank.TaskManager.dto.response.PageResponse;
import com.Mayank.TaskManager.exception.IdempotencyException;
import com.Mayank.TaskManager.exception.ResourceNotFoundException;
import com.Mayank.TaskManager.model.Task;
import com.Mayank.TaskManager.service.TaskService;
import com.Mayank.TaskManager.security.UserDetailsImpl;
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
    private TaskService taskService;

    @GetMapping
    public PageResponse<Task> getAllTasks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return taskService.findAllByUserId(userDetails.getId(), page, size);
    }

    @GetMapping("/pending")
    @PreAuthorize("hasRole('ROLE_CHECKER')")
    public PageResponse<Task> getPendingTasks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return taskService.findPendingTasks(page, size);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Task> getTask(@PathVariable String id, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        Task task = taskService.findByIdAndUserId(id, userDetails.getId());
        return task != null ? ResponseEntity.ok(task) : ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @PostMapping
    @PreAuthorize("hasRole('ROLE_MAKER') or hasRole('ROLE_USER')")
    public ResponseEntity<?> createTask(
            @RequestHeader(value = "Idempotency-Key", required = false) String idempotencyKey,
            @RequestBody Task task,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        try {
            Task created = taskService.create(task, userDetails.getId(), idempotencyKey);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (IdempotencyException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_MAKER') or hasRole('ROLE_USER')")
    public ResponseEntity<?> updateTask(
            @RequestHeader(value = "Idempotency-Key", required = false) String idempotencyKey,
            @PathVariable String id,
            @RequestBody Task task,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        try {
            Task updated = taskService.update(id, task, userDetails.getId(), idempotencyKey);
            return ResponseEntity.ok(updated);
        } catch (IdempotencyException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_MAKER') or hasRole('ROLE_USER')")
    public ResponseEntity<?> deleteTask(
            @RequestHeader(value = "Idempotency-Key", required = false) String idempotencyKey,
            @PathVariable String id,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        try {
            taskService.delete(id, userDetails.getId(), idempotencyKey);
            return ResponseEntity.ok().build();
        } catch (IdempotencyException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('ROLE_CHECKER')")
    public ResponseEntity<Task> approveTask(@PathVariable String id, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        Task approved = taskService.approve(id, userDetails.getId());
        return approved != null ? ResponseEntity.ok(approved) : ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasRole('ROLE_CHECKER')")
    public ResponseEntity<Task> rejectTask(@PathVariable String id, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        Task rejected = taskService.reject(id, userDetails.getId());
        return rejected != null ? ResponseEntity.ok(rejected) : ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
}
