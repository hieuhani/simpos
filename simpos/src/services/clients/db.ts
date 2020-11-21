import localForage from 'localforage';

export const db = localForage.createInstance({
  name: 'simpos_db',
  driver: localForage.INDEXEDDB,
});
