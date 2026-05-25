package com.todoapp.mapper;

import com.todoapp.dto.TodoResponse;
import com.todoapp.entity.Todo;
import org.springframework.stereotype.Component;

@Component
public class TodoMapper {

    public TodoResponse toResponse(Todo todo) {
        return new TodoResponse(
                todo.getId(),
                todo.getTitle(),
                todo.getDescription(),
                todo.isCompleted(),
                todo.getCreatedAt(),
                todo.getUpdatedAt()
        );
    }
}
