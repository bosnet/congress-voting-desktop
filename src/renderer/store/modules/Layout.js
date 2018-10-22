import moment from 'moment';

const state = {
  requestErrors: [],
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
  ERROR_REQUEST(state, error) {
    state.requestErrors.push(error);
    if (state.requestErrors.length > 10) {
      state.requestErrors = state.requestErrors.slice(0, 10);
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
  requestError({ commit }, error) {
    commit('ERROR_REQUEST', error);
  },
};

export default {
  state,
  mutations,
  actions,
};
