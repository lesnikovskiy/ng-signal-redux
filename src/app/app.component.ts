import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserService } from '@services/user.service';
import { TodoService } from '@services/todo.service';
import { ToDo } from '@models/todo';

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
  isLoading = this.todoService.isLoading;
  currentMember = this.todoService.currentMember;
  todosForMember = this.todoService.filteredToDos;
  errorMessage = this.todoService.errorMessage;

  // Actions
  onFilter(ele: EventTarget | null) {
    this.todoService.filterToDos((ele as HTMLInputElement).checked);
  }

  onSelected(ele: EventTarget | null): void {
    this.todoService.getToDosForMember(Number((ele as HTMLInputElement).value));
  }

  onChangeStatus(task: ToDo, ele: EventTarget | null) {
    this.todoService.changeStatus(task, (ele as HTMLInputElement).checked);
  }
}
