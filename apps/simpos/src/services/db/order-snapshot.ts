import { db } from './db';

export interface OrderPayload {
  id: string;
}

export const orderSnapshotRepository = {
  db: db.table('pos.order.snapshot'),

  async all(): Promise<OrderPayload[]> {
    return this.db.toArray();
  },

  async create(order: OrderPayload) {
    return this.db.put(order);
  },

  delete(id: string): Promise<void> {
    return this.db.delete(id);
  },
};
