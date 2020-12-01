import { db } from './db';

export interface PosSession {
  id: number;
  name: string;
  sequenceNumber: number;
  posConfigId: number;
  responsibleUserId: number;
}

export const posSessionRepository = {
  db: db.table<PosSession>('pos.session'),

  async all(): Promise<PosSession[]> {
    return this.db.toArray();
  },
};
