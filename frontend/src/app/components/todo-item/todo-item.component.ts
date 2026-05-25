import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Todo } from '../../models/todo.model';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [CommonModule, MatCheckboxModule, MatIconModule, MatButtonModule, MatCardModule],
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
  `]
})
export class TodoItemComponent {
  @Input() todo!: Todo;
  @Output() toggleClicked = new EventEmitter<number>();
  @Output() editClicked = new EventEmitter<Todo>();
  @Output() deleteClicked = new EventEmitter<number>();
}
