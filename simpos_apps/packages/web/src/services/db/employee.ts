import { db } from './db';
import { User } from './user';

export interface Employee {
  id?: number;
  name: string;
  user?: User;
  userId?: [number, string];
}

export const employeeRepository = {
  db: db.table<Employee>('hr.employee'),
  async findByIds(ids: number[]): Promise<Employee[]> {
    return this.db.where('id').anyOf(ids).toArray();
  },
};
