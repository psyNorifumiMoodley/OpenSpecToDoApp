import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TodoService } from './todo.service';
import { Todo, TodoRequest } from '../models/todo.model';
import { environment } from '../../environments/environment';

describe('TodoService', () => {
  let service: TodoService;
  let http: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/todos`;

  const mockTodo: Todo = {
    id: 1, title: 'Test', description: null, completed: false,
    createdAt: '2024-01-01T00:00:00', updatedAt: '2024-01-01T00:00:00'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TodoService]
    });
    service = TestBed.inject(TodoService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('getAll() calls GET /todos', () => {
    service.getAll().subscribe(todos => expect(todos).toEqual([mockTodo]));
    const req = http.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush([mockTodo]);
  });

  it('create() calls POST /todos', () => {
    const request: TodoRequest = { title: 'New', description: null };
    service.create(request).subscribe(todo => expect(todo).toEqual(mockTodo));
    const req = http.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(request);
    req.flush(mockTodo);
  });

  it('update() calls PUT /todos/:id', () => {
    const request: TodoRequest = { title: 'Updated', description: null };
    service.update(1, request).subscribe();
    const req = http.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockTodo);
  });

  it('delete() calls DELETE /todos/:id', () => {
    service.delete(1).subscribe();
    const req = http.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('toggle() calls PATCH /todos/:id/toggle', () => {
    service.toggle(1).subscribe();
    const req = http.expectOne(`${baseUrl}/1/toggle`);
    expect(req.request.method).toBe('PATCH');
    req.flush(mockTodo);
  });
});
