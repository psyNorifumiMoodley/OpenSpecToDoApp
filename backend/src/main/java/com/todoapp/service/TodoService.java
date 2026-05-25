package com.todoapp.service;

import com.todoapp.dto.TodoRequest;
import com.todoapp.dto.TodoResponse;
import com.todoapp.entity.Todo;
import com.todoapp.entity.User;
import com.todoapp.mapper.TodoMapper;
import com.todoapp.repository.TodoRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class TodoService {

    private final TodoRepository repository;
    private final TodoMapper mapper;

    public TodoService(TodoRepository repository, TodoMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public List<TodoResponse> findAll(User user) {
        return repository.findAllByUserOrderByCreatedAtDesc(user).stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public TodoResponse findById(Long id, User user) {
        return mapper.toResponse(getOrThrow(id, user));
    }

    public TodoResponse create(TodoRequest request, User user) {
        Todo todo = new Todo();
        todo.setTitle(request.title());
        todo.setDescription(request.description());
        todo.setDueDate(request.dueDate());
        todo.setUser(user);
        return mapper.toResponse(repository.save(todo));
    }

    public TodoResponse update(Long id, TodoRequest request, User user) {
        Todo todo = getOrThrow(id, user);
        todo.setTitle(request.title());
        todo.setDescription(request.description());
        todo.setDueDate(request.dueDate());
        return mapper.toResponse(repository.save(todo));
    }

    public void delete(Long id, User user) {
        getOrThrow(id, user);
        repository.deleteByIdAndUser(id, user);
    }

    public TodoResponse toggleCompleted(Long id, User user) {
        Todo todo = getOrThrow(id, user);
        todo.setCompleted(!todo.isCompleted());
        return mapper.toResponse(repository.save(todo));
    }

    private Todo getOrThrow(Long id, User user) {
        return repository.findByIdAndUser(id, user)
                .orElseThrow(() -> new EntityNotFoundException("Todo not found with id: " + id));
    }
}
