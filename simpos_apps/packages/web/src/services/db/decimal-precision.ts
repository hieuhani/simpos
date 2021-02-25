import { db } from './db';

export interface DecimalPrecision {
  id: number;
  name: string;
  digits: number;
}

export const decimalPrecisionRepository = {
  db: db.table<DecimalPrecision>('decimal.precision'),
  async all(): Promise<DecimalPrecision[]> {
    return this.db.toArray();
  },
};
