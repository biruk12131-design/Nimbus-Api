export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'admin' | 'user';
  avatarUrl: string;
  createdAt: string;
}

export const users: User[] = [];
