import config from 'config';
import Dexie from 'dexie';
import moment from 'moment';
import wallet from '@/lib/wallet';
import wire from '@/lib/wire';
import { remoteRPC } from '@/lib/rpc';
import unit from '@/lib/unit';

const db = new Dexie('walletDb');

db.version(1).stores({
  wallets: '&address,title,data,ts',
});

const state = {
  wallets: [],
};

const mutations = {
  LOAD_WALLETS(state, wallets) {
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
  UPDATE_MEMBERSHIP(state, { address, membership }) {
    state.wallets = state.wallets.map((w) => {
      if (w.address === address) {
        w.membership = membership;
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
        wallets[i].membership = null;
      }
      commit('LOAD_WALLETS', wallets);
      dispatch('updateAllBalance', wallets.map(w => w.address));
      dispatch('updateMembership', wallets.map(w => w.address));
    });
  },

  freeze({ dispatch, getters }, { address, amount, passphrase }) {
    return Promise.all([
      remoteRPC.getAccount(address),
      getters.getWallet(address),
    ]).then((res) => {
      const seed = wallet.decryptWallet(passphrase, res[1].data);
      const seqId = res[0].sequenceid;
      const account = wallet.createFreezeAccount(seed, seqId);
      const tx = wire.createFreezeAccountTx(
        address,
        parseInt(unit.convert(amount, 'bos', 'gon'), 10),
        config.get('fee'),
        seqId,
        account.publicKey(),
      );

      return wallet.hash(tx.nestedArrays()).then((hash) => {
        tx.updateSignature(wallet.sign(seed, hash));
        return dispatch('sendTx', tx.json());
      });
    });
  },

  unfreeze({ dispatch, getters }, { ownerAddress, passphrase, op }) {
    return Promise.all([
      remoteRPC.getTransaction(op.tx_hash),
      remoteRPC.getAccount(op.target),
      getters.getWallet(ownerAddress),
    ]).then((res) => {
      const tx = res[0];
      const source = res[1];
      const encryptedWallet = res[2].data;
      const seed = wallet.decryptWallet(passphrase, encryptedWallet);
      const sourceKeyPair = wallet.createFreezeAccount(seed, tx.sequenceid);
      const data = wire.createUnfreezeRequestTx(
        sourceKeyPair.publicKey(),
        config.get('fee'),
        source.sequenceid,
      );

      return wallet.hash(data.nestedArrays()).then((hash) => {
        data.updateSignature(wallet.sign(seed, hash));
        return dispatch('sendTx', data.json());
      });
    });
  },

  payment({ dispatch, getters }, { sourceAddress, passphrase, amount }) {
    return Promise.all([
      remoteRPC.getAccount(sourceAddress),
      getters.getWallet(sourceAddress),
    ]).then((res) => {
      const seed = wallet.decryptWallet(passphrase, res[1].data);
      const seqId = res[0].sequenceid;
      const account = wallet.createFreezeAccount(seed, seqId);
      const tx = wire.createFreezeAccountTx(
        sourceAddress,
        amount,
        config.get('fee'),
        seqId,
        account.publicKey(),
      );

      return wallet.hash(tx.nestedArrays()).then((hash) => {
        tx.updateSignature(wallet.sign(seed, hash));
        return dispatch('sendTx', tx.json());
      });
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
