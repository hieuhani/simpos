import Dexie from 'dexie';
import { databaseName, databaseVersion } from './config';

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

class AuthUserMetaDatabase extends Dexie {
  public db: Dexie.Table<AuthUserMeta, number>;

  public constructor() {
    super(databaseName);
    this.version(databaseVersion).stores({
      'auth.user.metas': '++id,name,dbName,username',
    });
    this.db = this.table('auth.user.metas');
  }

  async create(data: AuthUserMeta) {
    await this.db.add(data);
  }

  async first(): Promise<AuthUserMeta | undefined> {
    return this.db.limit(1).first();
  }
}

export const authUserMeta = new AuthUserMetaDatabase();
