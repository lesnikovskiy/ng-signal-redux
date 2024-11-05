import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { UserService } from './user.service';
import { ToDoState } from '@models/todo.state';
import { catchError, delay, map, Observable, of, Subject, switchMap, tap } from 'rxjs';
import { ToDo } from '@models/todo';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  todoUrl = 'https://jsonplaceholder.typicode.com/todos';

  private readonly http = inject(HttpClient);
  private readonly userService = inject(UserService);

  // Signal initial State
  private state = signal<ToDoState>({
    isLoading: false,
    currentMember: undefined,
    memberToDos: [],
    incompleteOnly: false,
    error: null,
  });

  // Selectors
  isLoading = computed(() => this.state().isLoading);
  currentMember = computed(() => this.state().currentMember);
  toDos = computed(() => this.state().memberToDos);
  incompleteOnly = computed(() => this.state().incompleteOnly);
  errorMessage = computed(() => this.state().error);
  filteredToDos = computed(() => {
    if (this.incompleteOnly()) {
      return this.toDos().filter(t => t.completed === false);
    }

    return this.toDos();
  });

  // Sources

  private selectedIdSubject = new Subject<number>();

  constructor() {
    this.selectedIdSubject.pipe(
      tap(() => this.setLoadingIndicator(true)),
      tap(id => this.setCurrentMember(id)),
      switchMap(id => this.getToDos(id)),
      delay(1000),
      takeUntilDestroyed()
    ).subscribe(todos => this.setMemberToDos(todos))
  }

  private setLoadingIndicator(isLoading: boolean) {
    this.state.update(state => ({
      ...state,
      isLoading
    }));
  }

  private setCurrentMember(id: number) {
    const currentMember = this.userService.getCurrentMember(id);

    this.state.update(state => ({
      ...state,
      currentMember,
      memberToDos: []
    }));
  }

  private getToDos(id: number): Observable<ToDo[]> {
    return this.http.get<ToDo[]>(`${this.todoUrl}?userId=${id}`).pipe(
      map(data => data.map(t => 
        t.title.length > 20 ? ({ ...t, title: t.title.substring(0, 20) }) : t
      )),
      catchError(err => this.setError(err))
    )
  }

  private setMemberToDos(todos: ToDo[]): void {
    this.state.update(state => ({
      ...state,
      memberToDos: todos,
      isLoading: false,
    }));
  }

  private setError(err: HttpErrorResponse): Observable<ToDo[]> {
    const error = setErrorMessage(err);
    this.state.update(state => ({
      ...state,
      error
    }));

    return of([]);
  }

  filterToDos(filter: boolean) {
    this.state.update(state => ({
      ...state,
      incompleteOnly: filter,
    }));
  }

  getToDosForMember(memberId: number) {
    return this.selectedIdSubject.next(memberId);
  }

  changeStatus(task: ToDo, status: boolean) {
    const updatedTasks = this.toDos().map(t => t.id === task.id ? { ...t, completed: status } : t);
    this.state.update(state => ({
      ...state,
      memberToDos: updatedTasks
    }));
  }
}

export function setErrorMessage(err: HttpErrorResponse): string {
  let errorMessage: string;

  if (err.error instanceof ErrorEvent) {
    errorMessage = `An error occurred: ${err.error.message}`;
  } else {
    errorMessage = `Backend returned code ${err.status}: ${err.message}`;
  }

  console.log(err);

  return errorMessage;
}
