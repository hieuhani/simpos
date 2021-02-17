import { db } from './db';
export interface AuthUserContext {
  lang: string;
  tz: string;
}
export interface AuthUserMeta {
  id?: number;
  uid: number;
  accessToken: string;
  name: string;
  dbName: string;
  username: string;
  userContext: AuthUserContext;
}

export const authUserMeta = {
  db: db.table('auth.user.metas'),
  async create(data: AuthUserMeta) {
    await this.db.add(data);
  },

  async first(): Promise<AuthUserMeta | undefined> {
    return this.db.limit(1).first();
  },
  async clear(): Promise<void> {
    return this.db.clear();
  },

  async update(metadata: Partial<AuthUserMeta>) {
    const meta = await this.first();
    if (!meta) {
      throw new Error('No metadata found');
    }
    return this.db.update(meta.id, metadata);
  },
};
