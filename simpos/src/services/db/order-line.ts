import { db } from './db';

export interface OrderLine {
  id: number;
  orderId: string;
  priceUnit: number;
  productId: number;
  discount: number;
  qty: number;
  note: string;
  taxIds: number[];
}

export const orderLineRepository = {
  db: db.table<OrderLine>('pos.order.line'),

  async all(): Promise<OrderLine[]> {
    return this.db.toArray();
  },

  async getOrderLines(orderId: string): Promise<OrderLine[]> {
    return this.db.where('orderId').equals(orderId).toArray();
  },
};
