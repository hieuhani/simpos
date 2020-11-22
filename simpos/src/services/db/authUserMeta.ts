import { db } from './db';
export interface AuthUserContext {
  lang: string;
  tz: string;
}
export interface AuthUserMeta {
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
};
