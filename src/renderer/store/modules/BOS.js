import { instance as sebak } from '@/lib/sebak';
import { Keypair } from 'stellar-base';

const state = {
  freezes: {},
  proposals: {},
};

const actions = {
  updateAllBalance({ commit }, addresses) {
    for (let i = 0; i < addresses.length; i += 1) {
      const address = addresses[i];
      sebak.getAccount(address)
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
    }
  },
};

const mutations = {
};

const getters = {
  frozenAccounts: () => () => Promise.resolve([
    {
      balance: `${parseInt(Math.random() * 10, 10) * 10000}`,
      address: Keypair.random().publicKey(),
    },
    {
      balance: `${parseInt(Math.random() * 10, 10) * 10000}`,
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
