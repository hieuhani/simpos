import { db } from './db';

export interface RestaurantPrinter {
  id: number;
  name: string;
  productCategoriesIds: number[];
  printerType: 'network_printer' | 'iot';
  networkPrinterIp?: string;
}

export const restaurantPrinterRepository = {
  db: db.table<RestaurantPrinter>('restaurant.printer'),

  async all(): Promise<RestaurantPrinter[]> {
    return this.db.toArray();
  },
};
