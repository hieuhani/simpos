import Dexie from 'dexie';
import { databaseName } from './config';

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

class RootDatabase extends Dexie {
  public constructor() {
    super(databaseName);
  }

  async currentTableNames(): Promise<string[]> {
    await this.open();
    return this.tables.map(({ name }) => name);
  }

  async getByTableName(tableName: string): Promise<any> {
    const table = this.table(tableName);
    return table.toArray();
  }
}

export const rootDb = new RootDatabase();
