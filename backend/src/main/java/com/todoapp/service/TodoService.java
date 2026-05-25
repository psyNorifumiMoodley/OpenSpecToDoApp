package com.todoapp.service;

import com.todoapp.dto.TodoRequest;
import com.todoapp.dto.TodoResponse;
import com.todoapp.entity.Todo;
import com.todoapp.mapper.TodoMapper;
import com.todoapp.repository.TodoRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
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
    public List<TodoResponse> findAll() {
        return repository.findAll().stream()
                .sorted(Comparator.comparing(Todo::getCreatedAt).reversed())
                .map(mapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public TodoResponse findById(Long id) {
        return mapper.toResponse(getOrThrow(id));
    }

    public TodoResponse create(TodoRequest request) {
        Todo todo = new Todo();
        todo.setTitle(request.title());
        todo.setDescription(request.description());
        todo.setDueDate(request.dueDate());
        return mapper.toResponse(repository.save(todo));
    }

    public TodoResponse update(Long id, TodoRequest request) {
        Todo todo = getOrThrow(id);
        todo.setTitle(request.title());
        todo.setDescription(request.description());
        todo.setDueDate(request.dueDate());
        return mapper.toResponse(repository.save(todo));
    }

    public void delete(Long id) {
        getOrThrow(id);
        repository.deleteById(id);
    }

    public TodoResponse toggleCompleted(Long id) {
        Todo todo = getOrThrow(id);
        todo.setCompleted(!todo.isCompleted());
        return mapper.toResponse(repository.save(todo));
    }

    private Todo getOrThrow(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Todo not found with id: " + id));
    }
}
