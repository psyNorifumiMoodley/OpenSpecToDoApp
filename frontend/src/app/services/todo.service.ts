import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Todo, TodoRequest } from '../models/todo.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private readonly baseUrl = `${environment.apiUrl}/todos`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.baseUrl);
  }

  create(request: TodoRequest): Observable<Todo> {
    return this.http.post<Todo>(this.baseUrl, request);
  }

  update(id: number, request: TodoRequest): Observable<Todo> {
    return this.http.put<Todo>(`${this.baseUrl}/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  toggle(id: number): Observable<Todo> {
    return this.http.patch<Todo>(`${this.baseUrl}/${id}/toggle`, {});
  }
}
