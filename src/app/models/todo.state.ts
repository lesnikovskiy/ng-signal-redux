import { ToDo } from './todo';
import { User } from './user';

export interface ToDoState {
  isLoading: boolean;
  currentMember: User | undefined;
  memberToDos: ToDo[];
  incompleteOnly: boolean;
  error: string | null;
}
