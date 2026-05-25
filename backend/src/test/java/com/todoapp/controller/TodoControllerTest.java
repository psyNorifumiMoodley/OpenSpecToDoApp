package com.todoapp.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.todoapp.dto.TodoRequest;
import com.todoapp.dto.TodoResponse;
import com.todoapp.exception.GlobalExceptionHandler;
import com.todoapp.service.TodoService;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(TodoController.class)
@Import(GlobalExceptionHandler.class)
class TodoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private TodoService service;

    private final TodoResponse sample = new TodoResponse(
            1L, "Buy milk", "From store", false, null,
            LocalDateTime.now(), LocalDateTime.now()
    );

    @Test
    void getAll_returns200WithList() throws Exception {
        when(service.findAll()).thenReturn(List.of(sample));

        mockMvc.perform(get("/api/todos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Buy milk"));
    }

    @Test
    void getById_returns200() throws Exception {
        when(service.findById(1L)).thenReturn(sample);

        mockMvc.perform(get("/api/todos/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    void getById_returns404WhenNotFound() throws Exception {
        when(service.findById(99L)).thenThrow(new EntityNotFoundException("Not found"));

        mockMvc.perform(get("/api/todos/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    void create_returns201() throws Exception {
        TodoRequest request = new TodoRequest("New task", null, null);
        when(service.create(any())).thenReturn(sample);

        mockMvc.perform(post("/api/todos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value("Buy milk"));
    }

    @Test
    void create_withDueDate_returns201WithDueDate() throws Exception {
        LocalDate due = LocalDate.of(2025, 12, 31);
        TodoRequest request = new TodoRequest("New task", null, due);
        TodoResponse withDue = new TodoResponse(1L, "New task", null, false, due, LocalDateTime.now(), LocalDateTime.now());
        when(service.create(any())).thenReturn(withDue);

        mockMvc.perform(post("/api/todos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.dueDate").value("2025-12-31"));
    }

    @Test
    void create_returns400WhenTitleBlank() throws Exception {
        TodoRequest request = new TodoRequest("", null, null);

        mockMvc.perform(post("/api/todos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void update_returns200() throws Exception {
        TodoRequest request = new TodoRequest("Updated", null, null);
        when(service.update(eq(1L), any())).thenReturn(sample);

        mockMvc.perform(put("/api/todos/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }

    @Test
    void delete_returns204() throws Exception {
        mockMvc.perform(delete("/api/todos/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    void delete_returns404WhenNotFound() throws Exception {
        doThrow(new EntityNotFoundException("Not found")).when(service).delete(99L);

        mockMvc.perform(delete("/api/todos/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    void toggle_returns200() throws Exception {
        when(service.toggleCompleted(1L)).thenReturn(sample);

        mockMvc.perform(patch("/api/todos/1/toggle"))
                .andExpect(status().isOk());
    }
}
