import { remoteRPC } from '@/lib/rpc';
import { Keypair } from 'stellar-base';

const state = {
  freezes: {},
  proposals: {},
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
      .catch(res => this.dispatch('requestError', res.response))
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

  updateAllBalance({ commit, dispatch }, addresses) {
    const requests = [];
    for (let i = 0; i < addresses.length; i += 1) {
      const address = addresses[i];
      const req = remoteRPC.getAccount(address)
        .then((data) => {
          if (data && data.balance) {
            commit('UPDATE_BALANCE', {
              address,
              balance: data.balance,
            });
          } else {
            commit('UPDATE_BALANCE', {
              address,
              balance: '0',
            });
          }
        });
      requests.push(req);
    }

    return intercept({ commit, dispatch }).request(Promise.all(requests)).get();
  },
};

const mutations = {
};

const getters = {
  frozenAccounts: () => () => Promise.resolve([
    {
      balance: `${parseInt(Math.random() * 10, 10) * 10000 * 10000000}`,
      address: Keypair.random().publicKey(),
    },
    {
      balance: `${parseInt(Math.random() * 10, 10) * 10000 * 10000000}`,
      address: Keypair.random().publicKey(),
    },
  ]),
};

export default {
  state,
  actions,
  mutations,
  getters,
};
