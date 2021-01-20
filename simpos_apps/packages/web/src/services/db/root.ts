import { getSchemaIndexes } from '../../contexts/DataProvider/dataLoader';
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

export const rootDb = {
  async currentTableNames(): Promise<string[]> {
    await db.open();
    return db.tables.map(({ name }) => name);
  },

  async getByTableName(tableName: string): Promise<any> {
    try {
      const table = db.table(tableName);
      return table.toArray();
    } catch {
      return null;
    }
  },

  async bulkUpdateTable(tableName: string, rows: unknown[]) {
    const indexes = getSchemaIndexes(tableName);
    if (!indexes) {
      throw new Error('could not get schema indexes');
    }

    return db.table(tableName).bulkPut(rows);
  },
};
