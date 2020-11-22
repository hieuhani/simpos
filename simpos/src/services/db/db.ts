import Dexie from 'dexie';
import { getDexieSchema } from '../../contexts/DataProvider/dataLoader';
import { databaseName, databaseVersion } from './config';

function createDb() {
  const db = new Dexie(databaseName);
  db.version(databaseVersion).stores(getDexieSchema());
  return db;
}

export const db = createDb();
