import { db } from './db';

export interface PosConfig {
  id: number;
  name: string;
  paymentMethodIds: number[];
  uuid: string;
  employeeIds: number[];
}

export const posConfigRepository = {
  db: db.table<PosConfig>('pos.config'),

  async all(): Promise<PosConfig[]> {
    return this.db.toArray();
  },

  async findById(id: number): Promise<PosConfig | undefined> {
    return this.db.get(id);
  },
};
