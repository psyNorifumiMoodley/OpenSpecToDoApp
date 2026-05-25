package com.todoapp.repository;

import com.todoapp.entity.Todo;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class TodoRepositoryTest {

    @Autowired
    private TodoRepository repository;

    @Test
    void savesAndRetrieves() {
        Todo todo = new Todo();
        todo.setTitle("Buy milk");
        todo.setDescription("From the store");

        Todo saved = repository.save(todo);

        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getTitle()).isEqualTo("Buy milk");
        assertThat(saved.isCompleted()).isFalse();
    }

    @Test
    void findsById() {
        Todo todo = new Todo();
        todo.setTitle("Read a book");
        Todo saved = repository.save(todo);

        Optional<Todo> found = repository.findById(saved.getId());

        assertThat(found).isPresent();
        assertThat(found.get().getTitle()).isEqualTo("Read a book");
    }

    @Test
    void deletesById() {
        Todo todo = new Todo();
        todo.setTitle("To delete");
        Todo saved = repository.save(todo);

        repository.deleteById(saved.getId());

        assertThat(repository.findById(saved.getId())).isEmpty();
    }

    @Test
    void findsAll() {
        repository.save(createTodo("Task 1"));
        repository.save(createTodo("Task 2"));

        assertThat(repository.findAll()).hasSize(2);
    }

    private Todo createTodo(String title) {
        Todo todo = new Todo();
        todo.setTitle(title);
        return todo;
    }
}
