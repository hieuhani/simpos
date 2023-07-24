import { db } from './db';

export interface UOM {
  id: number;
  displayName: string;
  active: boolean;
  factor: number;
  name: string;
  factorInv: number;
  measureType: 'unit' | 'weight' | 'working_time' | 'length' | 'volume';
  uomType: 'bigger' | 'reference' | 'smaller';
  rounding: number;
  isPosGroupable: boolean;
}

export const uomRepository = {
  db: db.table<UOM>('uom.uom'),

  async all(): Promise<UOM[]> {
    return this.db.toArray();
  },
};
