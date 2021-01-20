import { db } from './db';

export interface Partner {
  id: number;
  name: string;
  mobile?: string;
  phone?: string;
  email?: string;
  vat?: string;
  street?: string;
  city?: string;
  comment?: string;
}

export const partnerRepository = {
  db: db.table<Partner>('res.partner'),
  async findById(id: number): Promise<Partner | undefined> {
    return this.db.get(id);
  },
  async all(): Promise<Partner[]> {
    return this.db.toArray();
  },
  async findPartners(keyword = ''): Promise<Partner[]> {
    return this.db.toArray();
  },
};
