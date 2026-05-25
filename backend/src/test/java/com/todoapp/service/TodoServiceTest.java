package com.todoapp.service;

import com.todoapp.dto.TodoRequest;
import com.todoapp.dto.TodoResponse;
import com.todoapp.entity.Todo;
import com.todoapp.mapper.TodoMapper;
import com.todoapp.repository.TodoRepository;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import org.mockito.ArgumentCaptor;

@ExtendWith(MockitoExtension.class)
class TodoServiceTest {

    @Mock
    private TodoRepository repository;

    @Mock
    private TodoMapper mapper;

    @InjectMocks
    private TodoService service;

    private Todo todo;
    private TodoResponse response;

    @BeforeEach
    void setUp() {
        todo = new Todo();
        todo.setId(1L);
        todo.setTitle("Test todo");
        todo.setDescription("Description");
        todo.setCompleted(false);
        todo.setCreatedAt(LocalDateTime.now());
        todo.setUpdatedAt(LocalDateTime.now());

        response = new TodoResponse(1L, "Test todo", "Description", false, null,
                todo.getCreatedAt(), todo.getUpdatedAt());
    }

    @Test
    void findAll_returnsAllTodos() {
        when(repository.findAll()).thenReturn(List.of(todo));
        when(mapper.toResponse(todo)).thenReturn(response);

        List<TodoResponse> result = service.findAll();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).title()).isEqualTo("Test todo");
    }

    @Test
    void findById_returnsMatchingTodo() {
        when(repository.findById(1L)).thenReturn(Optional.of(todo));
        when(mapper.toResponse(todo)).thenReturn(response);

        TodoResponse result = service.findById(1L);

        assertThat(result.id()).isEqualTo(1L);
    }

    @Test
    void findById_throwsWhenNotFound() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.findById(99L))
                .isInstanceOf(EntityNotFoundException.class);
    }

    @Test
    void create_savesAndReturnsTodo() {
        TodoRequest request = new TodoRequest("New todo", "Desc", null);
        when(repository.save(any())).thenReturn(todo);
        when(mapper.toResponse(todo)).thenReturn(response);

        TodoResponse result = service.create(request);

        assertThat(result).isNotNull();
        verify(repository).save(any(Todo.class));
    }

    @Test
    void create_withDueDate_setsDueDateOnEntity() {
        LocalDate due = LocalDate.of(2025, 12, 31);
        TodoRequest request = new TodoRequest("New todo", null, due);
        when(repository.save(any())).thenReturn(todo);
        when(mapper.toResponse(todo)).thenReturn(response);

        service.create(request);

        ArgumentCaptor<Todo> captor = ArgumentCaptor.forClass(Todo.class);
        verify(repository).save(captor.capture());
        assertThat(captor.getValue().getDueDate()).isEqualTo(due);
    }

    @Test
    void update_changesFieldsAndSaves() {
        TodoRequest request = new TodoRequest("Updated", "New desc", null);
        when(repository.findById(1L)).thenReturn(Optional.of(todo));
        when(repository.save(todo)).thenReturn(todo);
        when(mapper.toResponse(todo)).thenReturn(response);

        service.update(1L, request);

        assertThat(todo.getTitle()).isEqualTo("Updated");
        verify(repository).save(todo);
    }

    @Test
    void update_withDueDate_setsDueDateOnEntity() {
        LocalDate due = LocalDate.of(2026, 1, 15);
        TodoRequest request = new TodoRequest("Updated", null, due);
        when(repository.findById(1L)).thenReturn(Optional.of(todo));
        when(repository.save(todo)).thenReturn(todo);
        when(mapper.toResponse(todo)).thenReturn(response);

        service.update(1L, request);

        assertThat(todo.getDueDate()).isEqualTo(due);
    }

    @Test
    void delete_removesTodo() {
        when(repository.findById(1L)).thenReturn(Optional.of(todo));

        service.delete(1L);

        verify(repository).deleteById(1L);
    }

    @Test
    void delete_throwsWhenNotFound() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.delete(99L))
                .isInstanceOf(EntityNotFoundException.class);
    }

    @Test
    void toggleCompleted_flipsStatus() {
        when(repository.findById(1L)).thenReturn(Optional.of(todo));
        when(repository.save(todo)).thenReturn(todo);
        when(mapper.toResponse(todo)).thenReturn(response);

        service.toggleCompleted(1L);

        assertThat(todo.isCompleted()).isTrue();
    }
}
