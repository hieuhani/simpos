import { db } from './db';
import { ProductVariant, productVariantRepository } from './product-variant';

export interface OrderLine {
  id?: number;
  orderId: string;
  priceUnit: number;
  productId: number;
  discount: number;
  qty: number;
  note: string;
  applicableTaxIds: number[];
  productVariant?: ProductVariant;
}

export const orderLineRepository = {
  db: db.table<OrderLine>('pos.order.line'),

  async all(): Promise<OrderLine[]> {
    return this.db.toArray();
  },

  async getOrderLines(orderId: string): Promise<OrderLine[]> {
    const orderLines = await this.db.where('orderId').equals(orderId).toArray();
    return Promise.all(
      orderLines.map(async (orderLine) => {
        const productVariant = await productVariantRepository.findById(
          orderLine.productId,
        );
        return {
          ...orderLine,
          productVariant,
        };
      }),
    );
  },

  async create(orderLine: OrderLine) {
    return this.db.put(orderLine);
  },
};
