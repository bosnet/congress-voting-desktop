import moment from 'moment';

const state = {
  currentWallet: null,
  errors: [],
  requestCount: 0,
  lastRequestTs: 0,
};

const mutations = {
  SET_CURRENT_WALLET(state, wallet) {
    state.currentWallet = wallet;
  },
  UPDATE_WALLET(state, wallet) {
    if (state.currentWallet && state.currentWallet.address === wallet.address) {
      Object.assign(state.currentWallet, wallet);
    }
  },
  START_REQUEST(state) {
    state.requestCount += 1;
    state.lastRequestTs = moment.now();
  },
  END_REQUEST(state) {
    state.requestCount -= 1;
  },
  ERROR(state, error) {
    state.errors.push(error);
    if (state.errors.length > 1000) {
      state.errors = state.errors.slice(state.errors.length - 1000);
    }
  },
  UPDATE_MEMBERSHIP(state, { address, membership }) {
    if (state.currentWallet != null && state.currentWallet.address === address) {
      state.currentWallet.membership = membership;
    }
  },
};

const actions = {
  setCurrentWallet({ commit, dispatch }, wallet) {
    commit('SET_CURRENT_WALLET', wallet);
    if (wallet) {
      dispatch('updateMembership', { wallets: [wallet], mutable: false });
    }
  },
  addMessage({ commit }, message) {
    commit('ADD_MESSAGE', message);
  },
  requestStart({ commit }) {
    commit('START_REQUEST');
  },
  requestEnd({ commit }) {
    commit('END_REQUEST');
  },
  walletError({ commit }, error) {
    commit('ERROR', {
      type: 'wallet',
      error,
    });
  },
  requestError({ commit }, error) {
    commit('ERROR', {
      type: 'rpc',
      error,
    });
  },
};

export default {
  state,
  mutations,
  actions,
};
