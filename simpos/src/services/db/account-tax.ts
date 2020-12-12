import { db } from './db';

export interface AccountTax {
  id: number;
  amountType: 'fixed' | 'percent' | 'division' | 'group';
  childrenTaxIds: AccountTax[];
  includeBaseAmount: boolean;
  name: string;
  priceInclude: boolean;
  realTaxAmount: number;
  amount: number;
  sequence: number;
}

export const accountTaxRepository = {
  db: db.table<AccountTax>('account.tax'),

  async all(): Promise<AccountTax[]> {
    return this.db.toArray();
  },
};
