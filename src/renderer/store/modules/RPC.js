import { remoteRPC } from '@/lib/rpc';

const state = {
  frozenAccountOps: [],
};

class Request {
  constructor({ commit, dispatch }) {
    this.commit = commit;
    this.dispatch = dispatch;
  }

  request(instance) {
    this.instance = instance;
    return this;
  }

  get() {
    this.dispatch('requestStart');
    return this.instance
      .catch((res) => {
        this.dispatch('requestError', res.response);
        return this.instance;
      })
      .finally(() => this.dispatch('requestEnd'));
  }
}

function intercept(opts) {
  return new Request(opts);
}

const actions = {
  sendTx({ commit, dispatch }, tx) {
    return intercept({ commit, dispatch })
      .request(remoteRPC.sendTx(tx))
      .get();
  },

  sendVoteTx({ commit, dispatch }, { proposalId, payload }) {
    return intercept({ commit, dispatch })
      .request(remoteRPC.vote(proposalId, payload))
      .get();
  },

  clearFrozenAccounts({ commit }) {
    commit('UPDATE_FROZEN_ACCOUNT_OPS', []);
  },

  loadFrozenAccounts({ commit }, address) {
    return remoteRPC.getFrozenAccounts(address)
      .then(res => res._embedded.records || []) // eslint-disable-line no-underscore-dangle,
      .then(ops => commit('UPDATE_FROZEN_ACCOUNT_OPS', { address, ops }));
  },

  updateAllBalance({ commit, dispatch }, wallets) {
    const requests = [];
    for (let i = 0; i < wallets.length; i += 1) {
      const address = wallets[i].address;
      const req = remoteRPC.getAccount(address)
        .then((data) => {
          wallets[i].balance = data && data.balance ? data.balance : '0';
        })
        .catch(() => {
          wallets[i].balance = '-';
        });
      requests.push(req);
    }

    return intercept({ commit, dispatch }).request(Promise.all(requests)).get();
  },

  updateMembership({ commit, dispatch }, { wallets, mutable }) {
    const requests = [];
    for (let i = 0; i < wallets.length; i += 1) {
      const address = wallets[i].address;
      const req = remoteRPC.getMembership(address)
        .then((data) => {
          if (mutable) {
            wallets[i].membership = data;
          }
          return data;
        })
        .then(data => commit('UPDATE_MEMBERSHIP', {
          address,
          membership: data,
        }))
        .catch(() => {
          wallets[i].membership = null;
        });
      requests.push(req);
    }

    return intercept({ commit, dispatch }).request(Promise.all(requests)).get();
  },

  sendPreMembershipTx({ commit, dispatch }, payload) {
    return intercept({ commit, dispatch })
      .request(remoteRPC.registerPreMembership(payload))
      .get();
  },

  sendApplicantIdTx({ commit, dispatch }, { address, payload }) {
    return intercept({ commit, dispatch })
      .request(remoteRPC.updateApplicantId(address, payload))
      .get();
  },

  sendRegisterMembershipTx({ commit, dispatch }, { address }) {
    return intercept({ commit, dispatch })
      .request(remoteRPC.registerMembership(address))
      .get();
  },

  sendDeregisterMembershipTx({ commit, dispatch }, { address, signature }) {
    return intercept({ commit, dispatch })
      .request(remoteRPC.deregisterMembership(address, signature))
      .get();
  },
};

const mutations = {
  UPDATE_FROZEN_ACCOUNT_OPS(state, { ops }) {
    state.frozenAccountOps = ops;
  },
};

const getters = {
  account: () => address => remoteRPC.getAccount(address),

  getMembership: () => address => remoteRPC.getMembership(address),

  getSumsubAccessToken: () => address => remoteRPC.getSumsubAccessToken(address),

  getProposals: () => () => remoteRPC.getProposals(),
};

export default {
  state,
  actions,
  mutations,
  getters,
};
