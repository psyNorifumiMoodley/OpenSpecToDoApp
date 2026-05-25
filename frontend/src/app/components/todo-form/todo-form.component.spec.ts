import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodoFormComponent } from './todo-form.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('TodoFormComponent', () => {
  let fixture: ComponentFixture<TodoFormComponent>;
  let component: TodoFormComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoFormComponent, NoopAnimationsModule]
    }).compileComponents();
    fixture = TestBed.createComponent(TodoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates the component', () => {
    expect(component).toBeTruthy();
  });

  it('form is invalid when title is empty', () => {
    component.form.setValue({ title: '', description: '', dueDate: null });
    expect(component.form.invalid).toBeTrue();
  });

  it('form is valid when title is provided', () => {
    component.form.setValue({ title: 'Buy milk', description: '', dueDate: null });
    expect(component.form.valid).toBeTrue();
  });

  it('emits todoCreated with trimmed values and null dueDate on submit', () => {
    const emitted: any[] = [];
    component.todoCreated.subscribe((v: any) => emitted.push(v));
    component.form.setValue({ title: '  Buy milk  ', description: '  From store  ', dueDate: null });
    component.submit();
    expect(emitted[0]).toEqual({ title: 'Buy milk', description: 'From store', dueDate: null });
  });

  it('emits todoCreated with formatted dueDate when a date is selected', () => {
    const emitted: any[] = [];
    component.todoCreated.subscribe((v: any) => emitted.push(v));
    component.form.setValue({ title: 'Task', description: '', dueDate: new Date(2025, 11, 31) });
    component.submit();
    expect(emitted[0].dueDate).toBe('2025-12-31');
  });

  it('resets form after submit', () => {
    component.form.setValue({ title: 'Task', description: '', dueDate: null });
    component.submit();
    expect(component.form.value.title).toBeNull();
  });
});
