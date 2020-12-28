import { User } from './user';

export interface Employee {
  id?: number;
  name: string;
  user?: User;
}
