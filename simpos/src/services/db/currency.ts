import { db } from './db';

export interface Currency {
  id: number;
  name: string;
  symbol: string;
  position: 'after' | 'before';
  rounding: number;
  rate?: number;
  decimals: number;
}

const defaultCurrency: Currency = {
  id: 0,
  name: 'Default',
  symbol: '$',
  position: 'after',
  rounding: 0.01,
  decimals: 2,
};

export const currencyRepository = {
  db: db.table<Currency>('res.currency'),
  async findById(id: number): Promise<Currency | undefined> {
    const currency = await this.db.get(id);

    return this.compute(currency);
  },
  async findByIds(ids: number[]): Promise<Currency[]> {
    const currencies = await this.db.where('id').anyOf(ids).toArray();
    return Promise.all(currencies.map(this.compute));
  },

  async compute(currency = defaultCurrency): Promise<Currency> {
    return {
      ...currency,
      decimals: Math.ceil(Math.log(1.0 / currency.rounding) / Math.log(10)),
    };
  },
};
