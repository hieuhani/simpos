import { db } from './db';

export interface PaymentMethod {
  id: number;
  name: string;
}

export const paymentMethodRepository = {
  db: db.table<PaymentMethod>('pos.payment.method'),

  async all(): Promise<PaymentMethod[]> {
    return this.db.toArray();
  },
};
