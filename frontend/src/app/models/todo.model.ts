export interface Todo {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TodoRequest {
  title: string;
  description: string | null;
  dueDate: string | null;
}
