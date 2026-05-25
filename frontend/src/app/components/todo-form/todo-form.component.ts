import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { TodoRequest } from '../../models/todo.model';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule,
    MatDatepickerModule, MatNativeDateModule
  ],
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
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Due date (optional)</mat-label>
            <input matInput [matDatepicker]="picker" formControlName="dueDate" placeholder="MM/DD/YYYY">
            <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
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
      description: [''],
      dueDate: [null]
    });
  }

  submit(): void {
    if (this.form.valid) {
      const dueDateValue: Date | null = this.form.value.dueDate;
      this.todoCreated.emit({
        title: this.form.value.title.trim(),
        description: this.form.value.description?.trim() || null,
        dueDate: dueDateValue ? this.formatDate(dueDateValue) : null
      });
      this.form.reset();
    }
  }

  private formatDate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
}
