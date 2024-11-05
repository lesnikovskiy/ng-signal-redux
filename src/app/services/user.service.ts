import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { User } from '@models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly userUrl = 'https://jsonplaceholder.typicode.com/users';
  private readonly http = inject(HttpClient);

  members = toSignal(this.http.get<User[]>(this.userUrl), { initialValue: [] });

  getCurrentMember(id: number): User | undefined {
    return this.members().find(m => m.id === id);
  }
}
