package com.todoapp.repository;

import com.todoapp.entity.Todo;
import com.todoapp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TodoRepository extends JpaRepository<Todo, Long> {
    List<Todo> findAllByUserOrderByCreatedAtDesc(User user);
    Optional<Todo> findByIdAndUser(Long id, User user);
    void deleteByIdAndUser(Long id, User user);
}
