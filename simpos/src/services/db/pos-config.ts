import { Company, companyRepository } from './company';
import { Currency, currencyRepository } from './currency';
import { db } from './db';

export interface PosConfig {
  id: number;
  name: string;
  paymentMethodIds: number[];
  uuid: string;
  employeeIds: number[];
  usePricelist: boolean;
  availablePricelistIds: number[];
  pricelistId: [number, string];
  companyId: [number, string];
  currencyId: [number, string];
  currency: Currency;
  company: Company;
  ifaceTaxIncluded: 'subtotal' | 'total';
  posSessionUsername?: string;
  modulePosHr?: boolean;
  posSessionState?:
    | 'new_session'
    | 'opening_control'
    | 'opened'
    | 'closing_control';
}

export const posConfigRepository = {
  db: db.table<PosConfig>('pos.config'),

  async all(): Promise<PosConfig[]> {
    return this.db.toArray();
  },

  async findById(id: number): Promise<PosConfig | undefined> {
    const config = await this.db.get(id);
    if (!config) {
      return undefined;
    }
    return this.enrichPosConfig(config);
  },

  async enrichPosConfig(posConfig: PosConfig): Promise<PosConfig> {
    const [company, currency] = await Promise.all([
      companyRepository.findById(posConfig.companyId[0]),
      currencyRepository.findById(posConfig.currencyId[0]),
    ]);

    return {
      ...posConfig,
      company: company!,
      currency: currency!,
    };
  },
};
