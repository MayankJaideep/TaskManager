package com.Mayank.TaskManager.controller;

import com.Mayank.TaskManager.model.Task;
import com.Mayank.TaskManager.service.TaskService;
import com.Mayank.TaskManager.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @GetMapping
    public List<Task> getAllTasks(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return taskService.findAllByUserId(userDetails.getId());
    }

    @GetMapping("/{id}")
    public Task getTask(@PathVariable String id, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return taskService.findByIdAndUserId(id, userDetails.getId());
    }

    @PostMapping
    public Task createTask(@RequestBody Task task, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return taskService.create(task, userDetails.getId());
    }

    @PutMapping("/{id}")
    public Task updateTask(@PathVariable String id, @RequestBody Task task, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return taskService.update(id, task, userDetails.getId());
    }

    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable String id, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        taskService.delete(id, userDetails.getId());
    }
}
