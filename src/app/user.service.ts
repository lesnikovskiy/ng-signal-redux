import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  members = signal<User[]>([
    { id: 1, name: 'Frank Wierman' },
    { id: 2, name: 'Bill Gates' },
    { id: 3, name: 'Jeff Besos' },
  ]);
}

export interface User {
  id: number;
  name: string;
}
