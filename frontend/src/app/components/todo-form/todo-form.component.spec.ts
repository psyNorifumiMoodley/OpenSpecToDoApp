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
    component.form.setValue({ title: '', description: '' });
    expect(component.form.invalid).toBeTrue();
  });

  it('form is valid when title is provided', () => {
    component.form.setValue({ title: 'Buy milk', description: '' });
    expect(component.form.valid).toBeTrue();
  });

  it('emits todoCreated with trimmed values on submit', () => {
    const emitted: any[] = [];
    component.todoCreated.subscribe((v: any) => emitted.push(v));
    component.form.setValue({ title: '  Buy milk  ', description: '  From store  ' });
    component.submit();
    expect(emitted[0]).toEqual({ title: 'Buy milk', description: 'From store' });
  });

  it('resets form after submit', () => {
    component.form.setValue({ title: 'Task', description: '' });
    component.submit();
    expect(component.form.value.title).toBeNull();
  });
});
