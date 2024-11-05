import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  todoUrl = 'https://jsonplaceholder.typicode.com/todos';

  private readonly http = inject(HttpClient);
}

export interface ToDo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

export interface ToDoState {
  isLoading: boolean;
  currentMember: User | undefined;
  memberToDos: ToDo[];
  error: string | null;
}
