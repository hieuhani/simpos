import { db } from './db';

export interface Preference {
  id?: string;
  lastImagesDownloaded?: Date;
}

export const preferenceRepository = {
  db: db.table<Preference>('preference'),

  async update(preference: Partial<Preference>): Promise<any> {
    return this.db.put({
      id: 'preference',
      ...preference,
    });
  },
  get(): Promise<Preference | undefined> {
    return this.db.toCollection().first();
  },
};
