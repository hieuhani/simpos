import { db } from './db';
import { posSessionRepository } from './pos-session';

import { zeroPad } from '../../utils';
import { DataContextState } from '../../contexts/DataProvider';
import { Partner, partnerRepository } from './partner';
import {
  ProductPricelist,
  productPricelistRepository,
} from './product-pricelist';

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
  partner?: Partner;
  pricelist?: ProductPricelist;
}

export const orderRepository = {
  db: db.table<Order>('pos.order'),
  async findById(id: string): Promise<Order | undefined> {
    const order = await this.db.get(id);
    if (!order) {
      return undefined;
    }

    return this.enrichOrder(order);
  },
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
    return {
      ...order,
      pricelist: defaultPriceList,
    };
  },
  delete(id: string): Promise<void> {
    return this.db.delete(id);
  },
  update(id: string, order: Partial<Order>): Promise<number> {
    return this.db.update(id, order);
  },
  async enrichOrder(order: Order): Promise<Order> {
    let partner;
    if (order.partnerId) {
      partner = await partnerRepository.findById(order.partnerId);
    }

    const pricelist = await productPricelistRepository.findById(
      order.pricelistId,
    );
    return {
      ...order,
      partner,
      pricelist,
    };
  },
};
