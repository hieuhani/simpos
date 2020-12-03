import { Currency, currencyRepository } from './currency';
import { db } from './db';

export interface Company {
  id: number;
  name: string;
  currencyId: [number, string];
  partnerId: [number, string];
  phone: string;
  taxCalculationRoundingMethod: 'round_per_line' | 'round_globally';
  currency: Currency;
}

export const companyRepository = {
  db: db.table<Company>('res.company'),
  async findById(id: number): Promise<Company | undefined> {
    const company = await this.db.get(id);
    if (!company) {
      return undefined;
    }
    return this.enrichCompany(company);
  },

  async enrichCompany(company: Company): Promise<Company> {
    const [currency] = await Promise.all([
      currencyRepository.findById(company.currencyId[0]),
    ]);

    return {
      ...company,
      currency: currency!,
    };
  },
};
