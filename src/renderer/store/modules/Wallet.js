import Dexie from 'dexie';
import moment from 'moment';

const db = new Dexie('walletDb');

db.version(1).stores({
  wallets: '&address,title,data,ts',
  trashes: '++id,address,title,data,ts',
  caches: '&address,data,ts',
});

const state = {
  wallets: [],
};

const mutations = {
  async LOAD_WALLETS(state, wallets) {
    state.wallets = wallets;
  },
  ADD_WALLET(state, wallet) {
    state.wallets.push(wallet);
  },
  DELETE_WALLET(state, wallet) {
    state.wallets = state.wallets.filter(w => w.address === wallet.address);
  },
  UPDATE_WALLET(state, wallet) {
    state.wallets = state.wallets.map(w => (w.address === wallet.address ? wallet : w));
  },
  UPDATE_BALANCE(state, { address, balance }) {
    state.wallets = state.wallets.map((w) => {
      if (w.address === address) {
        w.balance = balance;
      }
      return w;
    });
  },
};

function beginTx(mode, table, action) {
  return db.open().then(() => new Promise(((resolve, reject) => {
    db.transaction(mode, table, () => {
      const promise = action();
      if (promise != null) {
        promise.then(resolve).catch(reject);
      }
      return promise;
    }).catch(reject);
  })));
}

const actions = {
  loadWallets({ commit, dispatch }) {
    db.wallets.toArray().then((wallets) => {
      for (let i = 0; i < wallets.length; i += 1) {
        wallets[i].balance = '0';
      }
      commit('LOAD_WALLETS', wallets);
      dispatch('updateAllBalance', wallets.map(w => w.address));
    });
  },

  addWallet({ commit }, wallet) {
    return new Promise((resolve, reject) => {
      beginTx('rw', db.wallets, async () => {
        db.wallets.get(wallet.address).then((rs) => {
          if (rs == null) {
            wallet.ts = moment.now();
            db.wallets.add(wallet)
              .then(() => commit('ADD_WALLET', wallet))
              .then(() => resolve(wallet))
              .catch(reject);
          }
        });
      });
    });
  },

  deleteWalletByAddress({ commit }, address) {
    return new Promise((resolve, reject) => {
      beginTx('rw', db.wallets, async () => {
        const wallet = await db.wallets.get(address);
        db.wallets.delete(address)
          .then(() => commit('DELETE_WALLET', wallet))
          .then(() => resolve(wallet))
          .catch(reject);
      });
    }).then((wallet) => {
      wallet.ts = moment.now();
      beginTx('rw', db.trashes, () => db.trashes.add(wallet));
    });
  },

  updateWallet({ commit }, wallet) {
    return new Promise(((resolve, reject) => {
      beginTx('rw', db.wallets, async () => {
        const rs = await db.wallets.get(wallet.address);
        if (rs != null) {
          db.wallets.update(wallet.address, wallet)
            .then(() => commit('UPDATE_WALLET', wallet))
            .then(() => resolve(wallet))
            .catch(reject);
        }
      });
    }));
  },
};

const getters = {
  getWallet: () => address => beginTx('r', db.wallets, () => db.wallets.get(address)),
};

export default {
  state,
  mutations,
  actions,
  getters,
};
