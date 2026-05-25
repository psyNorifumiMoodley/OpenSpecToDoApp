import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { TodoRequest } from '../../models/todo.model';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule],
  template: `
    <mat-card class="form-card">
      <mat-card-content>
        <form [formGroup]="form" (ngSubmit)="submit()">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Title</mat-label>
            <input matInput formControlName="title" placeholder="What needs to be done?">
            <mat-error *ngIf="form.get('title')?.hasError('required')">Title is required</mat-error>
          </mat-form-field>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Description (optional)</mat-label>
            <textarea matInput formControlName="description" rows="2" placeholder="Add details..."></textarea>
          </mat-form-field>
          <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">Add Todo</button>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .form-card { margin-bottom: 16px; }
    .full-width { width: 100%; margin-bottom: 8px; display: block; }
  `]
})
export class TodoFormComponent {
  @Output() todoCreated = new EventEmitter<TodoRequest>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      title: ['', [Validators.required]],
      description: ['']
    });
  }

  submit(): void {
    if (this.form.valid) {
      this.todoCreated.emit({
        title: this.form.value.title.trim(),
        description: this.form.value.description?.trim() || null
      });
      this.form.reset();
    }
  }
}
