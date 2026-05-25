package com.todoapp.controller;

import com.todoapp.dto.TodoRequest;
import com.todoapp.dto.TodoResponse;
import com.todoapp.entity.User;
import com.todoapp.service.TodoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/todos")
public class TodoController {

    private final TodoService service;

    public TodoController(TodoService service) {
        this.service = service;
    }

    @GetMapping
    public List<TodoResponse> getAll(@AuthenticationPrincipal User user) {
        return service.findAll(user);
    }

    @GetMapping("/{id}")
    public TodoResponse getById(@PathVariable Long id, @AuthenticationPrincipal User user) {
        return service.findById(id, user);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TodoResponse create(@Valid @RequestBody TodoRequest request,
                               @AuthenticationPrincipal User user) {
        return service.create(request, user);
    }

    @PutMapping("/{id}")
    public TodoResponse update(@PathVariable Long id,
                               @Valid @RequestBody TodoRequest request,
                               @AuthenticationPrincipal User user) {
        return service.update(id, request, user);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id, @AuthenticationPrincipal User user) {
        service.delete(id, user);
    }

    @PatchMapping("/{id}/toggle")
    public TodoResponse toggle(@PathVariable Long id, @AuthenticationPrincipal User user) {
        return service.toggleCompleted(id, user);
    }
}
