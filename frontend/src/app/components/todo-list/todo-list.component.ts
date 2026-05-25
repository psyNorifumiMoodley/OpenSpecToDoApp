import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';

import { Todo, TodoRequest } from '../../models/todo.model';
import { TodoService } from '../../services/todo.service';
import { TodoFormComponent } from '../todo-form/todo-form.component';
import { TodoItemComponent } from '../todo-item/todo-item.component';
import { TodoEditDialogComponent } from '../todo-edit-dialog/todo-edit-dialog.component';

type Filter = 'all' | 'active' | 'completed';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonToggleModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule,
    TodoFormComponent,
    TodoItemComponent
  ],
  template: `
    <mat-toolbar color="primary">
      <span>My Todos</span>
    </mat-toolbar>

    <div class="container">
      <app-todo-form (todoCreated)="onCreate($event)"></app-todo-form>

      <div class="filter-row">
        <mat-button-toggle-group [value]="activeFilter()" (change)="activeFilter.set($event.value)">
          <mat-button-toggle value="all">All</mat-button-toggle>
          <mat-button-toggle value="active">Active</mat-button-toggle>
          <mat-button-toggle value="completed">Completed</mat-button-toggle>
        </mat-button-toggle-group>
        <span class="count">{{ filteredTodos().length }} item(s)</span>
      </div>

      <div *ngIf="loading()" class="spinner-wrap">
        <mat-progress-spinner mode="indeterminate" diameter="40"></mat-progress-spinner>
      </div>

      <div *ngIf="!loading()">
        <app-todo-item
          *ngFor="let todo of filteredTodos(); trackBy: trackById"
          [todo]="todo"
          (toggleClicked)="onToggle($event)"
          (editClicked)="onEdit($event)"
          (deleteClicked)="onDelete($event)">
        </app-todo-item>

        <div *ngIf="filteredTodos().length === 0" class="empty-state">
          <p *ngIf="activeFilter() === 'all'">No todos yet. Add one above!</p>
          <p *ngIf="activeFilter() === 'active'">No active todos.</p>
          <p *ngIf="activeFilter() === 'completed'">No completed todos yet.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container { max-width: 700px; margin: 24px auto; padding: 0 16px; }
    .filter-row { display: flex; align-items: center; gap: 16px; margin-bottom: 16px; }
    .count { color: #666; font-size: 0.9rem; }
    .spinner-wrap { display: flex; justify-content: center; padding: 32px; }
    .empty-state { text-align: center; padding: 32px; color: #888; font-size: 1.1rem; }
  `]
})
export class TodoListComponent implements OnInit {
  todos = signal<Todo[]>([]);
  activeFilter = signal<Filter>('all');
  loading = signal(false);

  filteredTodos = computed(() => {
    const filter = this.activeFilter();
    const all = this.todos();
    if (filter === 'active') return all.filter(t => !t.completed);
    if (filter === 'completed') return all.filter(t => t.completed);
    return all;
  });

  constructor(
    private todoService: TodoService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadTodos();
  }

  loadTodos(): void {
    this.loading.set(true);
    this.todoService.getAll().subscribe({
      next: todos => {
        this.todos.set(todos);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.snackBar.open('Failed to load todos', 'Dismiss', { duration: 3000 });
      }
    });
  }

  onCreate(request: TodoRequest): void {
    this.todoService.create(request).subscribe({
      next: () => this.loadTodos(),
      error: () => this.snackBar.open('Failed to create todo', 'Dismiss', { duration: 3000 })
    });
  }

  onToggle(id: number): void {
    this.todoService.toggle(id).subscribe({
      next: () => this.loadTodos(),
      error: () => this.snackBar.open('Failed to update todo', 'Dismiss', { duration: 3000 })
    });
  }

  onEdit(todo: Todo): void {
    const dialogRef = this.dialog.open(TodoEditDialogComponent, {
      width: '450px',
      data: todo
    });
    dialogRef.afterClosed().subscribe((result: TodoRequest | undefined) => {
      if (result) {
        this.todoService.update(todo.id, result).subscribe({
          next: () => this.loadTodos(),
          error: () => this.snackBar.open('Failed to update todo', 'Dismiss', { duration: 3000 })
        });
      }
    });
  }

  onDelete(id: number): void {
    this.todoService.delete(id).subscribe({
      next: () => this.loadTodos(),
      error: () => this.snackBar.open('Failed to delete todo', 'Dismiss', { duration: 3000 })
    });
  }

  trackById(_: number, todo: Todo): number {
    return todo.id;
  }
}
