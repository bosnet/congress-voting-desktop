import Dexie from 'dexie';
const db = new Dexie('walletDb');

db.version(1).stores({
  wallets: '&address,title,data,ts',
});

export default db;
