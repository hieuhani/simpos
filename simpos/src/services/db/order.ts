import { db } from './db';

export interface Order {
  id: string;
  name: string;
  uid: string;
  posSessionId: number;
  pricelistId: number;
  sequenceNumber: number;
  creationDate: Date;
}

export const orderRepository = {
  db: db.table<Order>('pos.order'),

  async all(): Promise<Order[]> {
    return this.db.toArray();
  },
};
