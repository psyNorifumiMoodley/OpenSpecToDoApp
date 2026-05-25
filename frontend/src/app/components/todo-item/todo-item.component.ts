import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { Todo } from '../../models/todo.model';

type DueDateState = 'overdue' | 'today' | 'upcoming' | null;

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [CommonModule, MatCheckboxModule, MatIconModule, MatButtonModule, MatCardModule, MatChipsModule],
  template: `
    <mat-card class="todo-card" [class.completed]="todo.completed">
      <mat-card-content class="todo-content">
        <mat-checkbox
          [checked]="todo.completed"
          (change)="toggleClicked.emit(todo.id)"
          color="primary">
        </mat-checkbox>
        <div class="todo-text">
          <span class="todo-title" [class.strikethrough]="todo.completed">{{ todo.title }}</span>
          <span class="todo-desc" *ngIf="todo.description">{{ todo.description }}</span>
          <span *ngIf="dueDateState()" class="due-badge" [ngClass]="'due-' + dueDateState()">
            <mat-icon class="badge-icon">schedule</mat-icon>
            {{ dueDateLabel() }}
          </span>
        </div>
        <div class="todo-actions">
          <button mat-icon-button (click)="editClicked.emit(todo)" aria-label="Edit">
            <mat-icon>edit</mat-icon>
          </button>
          <button mat-icon-button color="warn" (click)="deleteClicked.emit(todo.id)" aria-label="Delete">
            <mat-icon>delete</mat-icon>
          </button>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .todo-card { margin-bottom: 8px; }
    .todo-card.completed { opacity: 0.65; }
    .todo-content { display: flex; align-items: center; gap: 12px; }
    .todo-text { flex: 1; display: flex; flex-direction: column; }
    .todo-title { font-size: 1rem; }
    .todo-title.strikethrough { text-decoration: line-through; color: #888; }
    .todo-desc { font-size: 0.8rem; color: #666; margin-top: 2px; }
    .todo-actions { display: flex; gap: 4px; }

    .due-badge {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      font-size: 0.75rem;
      font-weight: 500;
      margin-top: 4px;
      padding: 2px 8px;
      border-radius: 12px;
      width: fit-content;
    }
    .badge-icon { font-size: 14px; width: 14px; height: 14px; line-height: 14px; }

    .due-overdue  { background: #fde8e8; color: #c0392b; }
    .due-today    { background: #fff3e0; color: #e65100; }
    .due-upcoming { background: #e8f5e9; color: #2e7d32; }
  `]
})
export class TodoItemComponent {
  @Input() todo!: Todo;
  @Output() toggleClicked = new EventEmitter<number>();
  @Output() editClicked = new EventEmitter<Todo>();
  @Output() deleteClicked = new EventEmitter<number>();

  dueDateState(): DueDateState {
    if (!this.todo.dueDate) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(this.todo.dueDate + 'T00:00:00');
    if (due < today) return 'overdue';
    if (due.getTime() === today.getTime()) return 'today';
    return 'upcoming';
  }

  dueDateLabel(): string {
    const state = this.dueDateState();
    if (!state) return '';
    if (state === 'overdue') return 'Overdue';
    if (state === 'today') return 'Due today';
    return 'Due ' + this.todo.dueDate;
  }
}
