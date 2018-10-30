import moment from 'moment';

const state = {
  errors: [],
  requestCount: 0,
  lastRequestTs: 0,
};

const mutations = {
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
};

const actions = {
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
