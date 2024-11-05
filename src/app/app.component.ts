import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { User, UserService } from './user.service';
import { ToDo, TodoService } from './todo.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  userService = inject(UserService);
  todoService = inject(TodoService);

  // Signals
  users = this.userService.members;
  isLoading = signal(false);
  currentMember = signal<User | undefined>(undefined);
  todosForMember = signal<ToDo[]>([]);
  errorMessage = signal(null);

  // Actions
  onFilter(ele: EventTarget | null) {}

  onSelected(ele: EventTarget | null): void {}

  onChangeStatus(task: ToDo, ele: EventTarget | null) {}
}
