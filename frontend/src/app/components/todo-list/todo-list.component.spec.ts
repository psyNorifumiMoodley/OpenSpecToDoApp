import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodoListComponent } from './todo-list.component';
import { TodoService } from '../../services/todo.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { Todo } from '../../models/todo.model';

const mockTodo: Todo = {
  id: 1, title: 'Test', description: null, completed: false,
  createdAt: '2024-01-01T00:00:00', updatedAt: '2024-01-01T00:00:00'
};

describe('TodoListComponent', () => {
  let fixture: ComponentFixture<TodoListComponent>;
  let component: TodoListComponent;
  let todoService: jasmine.SpyObj<TodoService>;

  beforeEach(async () => {
    todoService = jasmine.createSpyObj('TodoService', ['getAll', 'create', 'update', 'delete', 'toggle']);
    todoService.getAll.and.returnValue(of([mockTodo]));

    await TestBed.configureTestingModule({
      imports: [TodoListComponent, NoopAnimationsModule],
      providers: [
        { provide: TodoService, useValue: todoService },
        { provide: MatDialog, useValue: { open: () => ({ afterClosed: () => of(null) }) } },
        { provide: MatSnackBar, useValue: { open: () => {} } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TodoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates the component', () => {
    expect(component).toBeTruthy();
  });

  it('loads todos on init', () => {
    expect(todoService.getAll).toHaveBeenCalled();
    expect(component.todos()).toEqual([mockTodo]);
  });

  it('filteredTodos returns all when filter is all', () => {
    component.activeFilter.set('all');
    expect(component.filteredTodos()).toHaveSize(1);
  });

  it('filteredTodos returns only active when filter is active', () => {
    component.activeFilter.set('active');
    expect(component.filteredTodos()).toHaveSize(1);
  });

  it('filteredTodos returns empty when filter is completed and none completed', () => {
    component.activeFilter.set('completed');
    expect(component.filteredTodos()).toHaveSize(0);
  });
});
