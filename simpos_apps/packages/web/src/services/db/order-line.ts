import { db } from './db';
import { Order, orderRepository } from './order';
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
  order?: Order;
}

export const orderLineRepository = {
  db: db.table<OrderLine>('pos.order.line'),

  async all(): Promise<OrderLine[]> {
    return this.db.toArray();
  },

  async findById(id: number): Promise<OrderLine | undefined> {
    const orderLine = await this.db.get(id);
    if (!orderLine) {
      return undefined;
    }

    return this.enrichOrderLine(orderLine);
  },

  async getOrderLines(orderId: string): Promise<OrderLine[]> {
    const orderLines = await this.db.where('orderId').equals(orderId).toArray();
    return Promise.all(
      orderLines.map(async (orderLine) => {
        const [productVariant, order] = await Promise.all([
          productVariantRepository.findById(orderLine.productId),
          orderRepository.findById(orderLine.orderId),
        ]);
        return {
          ...orderLine,
          productVariant,
          order,
        };
      }),
    );
  },

  async enrichOrderLine(orderLine: OrderLine): Promise<OrderLine> {
    const productVariant = await productVariantRepository.findById(
      orderLine.productId,
    );
    return {
      ...orderLine,
      productVariant,
    };
  },

  async create(orderLine: OrderLine) {
    return this.db.put(orderLine);
  },

  async update(id: number, data: Partial<OrderLine>): Promise<number> {
    return this.db.update(id, data);
  },

  async delete(id: number): Promise<void> {
    return this.db.delete(id);
  },
};
