import { db } from './db';
import { posSessionRepository } from './pos-session';

import { zeroPad } from '../../utils';
import { DataContextState } from '../../contexts/DataProvider';

export interface Order {
  id: string;
  name: string;
  posSessionId: number;
  pricelistId: number;
  sequenceNumber: number;
  creationDate: Date;
  tableNo?: string;
  vibrationCardNo?: string;
  partnerId?: number;
}

export const orderRepository = {
  db: db.table<Order>('pos.order'),

  async all(): Promise<Order[]> {
    return this.db.toArray();
  },

  async addNewOrder({
    posSession,
    defaultPriceList,
  }: Pick<DataContextState, 'posSession' | 'defaultPriceList'>): Promise<
    Order
  > {
    const sequenceNumber = posSession.sequenceNumber + 1;
    // Generates a public identification number for the order.
    // The generated number must be unique and sequential. They are made 12 digit long
    // to fit into EAN-13 barcodes, should it be needed
    const orderId = [
      zeroPad(posSession.id, 5),
      zeroPad(posSession.loginNumber, 3),
      zeroPad(sequenceNumber, 4),
    ].join('-');
    const order: Order = {
      id: orderId,
      name: `Order ${orderId}`,
      sequenceNumber,
      posSessionId: posSession.id,
      pricelistId: defaultPriceList.id,
      creationDate: new Date(),
    };
    await db.transaction('rw', this.db, posSessionRepository.db, async () => {
      await this.db.add(order);
      await posSessionRepository.db.put({
        ...posSession,
        sequenceNumber,
      });
    });
    return order;
  },
  delete(id: string): Promise<void> {
    return this.db.delete(id);
  },
};
