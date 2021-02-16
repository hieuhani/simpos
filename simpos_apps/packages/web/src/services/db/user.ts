import { db } from './db';

export interface User {
  id: number;
  name: string;
  companyId: [number, string];
  groupsId: number[];
}

export const userRepository = {
  db: db.table<User>('res.users'),
  async all(): Promise<User[]> {
    return this.db.toArray();
  },
  async findById(id: number): Promise<User | undefined> {
    return this.db.get(id);
  },
};
