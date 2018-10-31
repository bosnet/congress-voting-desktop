import BigNumber from 'bignumber.js';
import config from 'config';
import moment from 'moment';
import wallet from '@/lib/wallet';
import wire from '@/lib/wire';
import { remoteRPC } from '@/lib/rpc';
import unit from '@/lib/unit';
import db from '@/lib/db';

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
    return db.wallets.toArray().then((wallets) => {
      for (let i = 0; i < wallets.length; i += 1) {
        wallets[i].balance = '0';
        wallets[i].membership = null;
      }
      commit('LOAD_WALLETS', wallets);
      dispatch('updateAllBalance', wallets.map(w => w.address));
      dispatch('updateMembership', wallets.map(w => w.address));
    });
  },

  vote({ dispatch, getters }, { address, proposalId, answer, passphrase }) {
    return getters.getWallet(address).then((res) => {
      const seed = wallet.decryptWallet(passphrase, res.data);
      const array = [address, proposalId, answer];
      const payload = {
        data: array,
        signature: '',
      };

      return wallet.hash(array).then((hash) => {
        payload.signature = wallet.sign(seed, hash);
        return dispatch('sendVoteTx', proposalId, payload);
      });
    });
  },

  async preMembership({ dispatch, getters }, { address, applicantId, passphrase }) {
    const res = await getters.getWallet(address);
    const seed = wallet.decryptWallet(passphrase, res.data);
    const array = [address, applicantId];
    const payload = {
      data: array,
      signature: '',
    };

    const hash = await wallet.hash(array);
    payload.signature = wallet.sign(seed, hash);
    await dispatch('sendPreMembershipTx', payload);
  },

  freeze({ dispatch, getters }, { address, amount, passphrase }) {
    return Promise.all([
      remoteRPC.getAccount(address),
      getters.getWallet(address),
    ]).then((res) => {
      const seed = wallet.decryptWallet(passphrase, res[1].data);
      const seqId = res[0].sequence_id;
      const account = wallet.createFreezeAccount(seed, seqId);
      const tx = wire.createFreezeAccountTx(
        address,
        unit.convertToNumber(amount, 'bos', 'gon'),
        config.get('fee'),
        seqId,
        account.publicKey(),
      );

      return wallet.hash(tx.nestedArrays()).then((hash) => {
        tx.updateSignature(wallet.sign(seed, hash));
        return dispatch('sendTx', tx.json())
          .then(() => { // eslint-disable-line arrow-body-style,
            // Return nothing if it succeeds.
            return {
              sender: address,
              address: account.publicKey(),
              sequenceId: seqId,
              amount: unit.convertToNumber(amount, 'bos', 'gon'),
            };
          });
      });
    });
  },

  unfreeze({ dispatch, getters }, { ownerAddress, address, passphrase, sequenceId }) {
    return Promise.all([
      remoteRPC.getAccount(address),
      getters.getWallet(ownerAddress),
    ]).then((res) => {
      const source = res[0];
      const encryptedWallet = res[1].data;
      const seed = wallet.decryptWallet(passphrase, encryptedWallet);
      const sourceKeyPair = wallet.createFreezeAccount(seed, sequenceId);
      const data = wire.createUnfreezeRequestTx(
        sourceKeyPair.publicKey(),
        config.get('fee'),
        source.sequence_id,
      );

      return wallet.hash(data.nestedArrays()).then((hash) => {
        data.updateSignature(wallet.sign(sourceKeyPair.secret(), hash));
        return dispatch('sendTx', data.json());
      });
    });
  },

  // withdraw function to transfer all the money held by frozen account to the general account.
  withdraw({ dispatch, getters }, { address, frozenAccountAddress, sequenceId, passphrase }) {
    return Promise.all([
      remoteRPC.getAccount(frozenAccountAddress),
      getters.getWallet(address),
    ]).then((res) => {
      const balance = new BigNumber(res[0].balance, 10);
      const seed = wallet.decryptWallet(passphrase, res[1].data);
      const account = wallet.createFreezeAccount(seed, sequenceId);
      const tx = wire.createPaymentTx(
        frozenAccountAddress,
        balance.minus(config.get('fee')).toNumber(),
        config.get('fee'),
        res[0].sequence_id,
        address,
      );

      return wallet.hash(tx.nestedArrays()).then((hash) => {
        tx.updateSignature(wallet.sign(account.secret(), hash));
        return dispatch('sendTx', tx.json());
      });
    });
  },

  payment({ dispatch, getters }, { address, target, amount, passphrase }) {
    return Promise.all([
      remoteRPC.getAccount(address),
      getters.getWallet(address),
    ]).then((res) => {
      const sequenceId = res[0].sequence_id;
      const seed = wallet.decryptWallet(passphrase, res[1].data);
      const tx = wire.createPaymentTx(
        address,
        amount,
        config.get('fee'),
        sequenceId,
        target,
      );

      return wallet.hash(tx.nestedArrays()).then((hash) => {
        tx.updateSignature(wallet.sign(seed, hash));
        return dispatch('sendTx', tx.json());
      });
    });
  },

  addWallet({ commit }, wallet) {
    return new Promise((resolve, reject) => beginTx('rw', db.wallets, async () => {
      db.wallets.get(wallet.address).then((rs) => {
        if (rs == null) {
          wallet.ts = moment.now();
          db.wallets.add(wallet)
            .then(() => commit('ADD_WALLET', wallet))
            .then(() => resolve(wallet))
            .catch(reject);
        } else {
          reject(new Error(`${wallet.address} is already registered.`));
        }
      });
    }));
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
