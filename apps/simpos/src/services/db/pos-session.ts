import { db } from './db';

export interface PosSession {
  id: number;
  name: string;
  sequenceNumber: number;
  posConfigId: number;
  responsibleUserId: number;
  loginNumber: number;
  state:
    | 'new_session'
    | 'opening_control'
    | 'opened'
    | 'closing_control'
    | 'closed';
  orderCount?: number;
  totalPaymentsAmount?: number;
  displayName?: string;
  userId: [number, string];
  configId: [number, string];
  startAt: string;
}

export const posSessionRepository = {
  db: db.table<PosSession>('pos.session'),

  async all(): Promise<PosSession[]> {
    return this.db.toArray();
  },
};
