package com.todoapp.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record TodoResponse(
        Long id,
        String title,
        String description,
        boolean completed,
        LocalDate dueDate,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}
