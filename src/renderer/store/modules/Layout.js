import moment from 'moment';

const state = {
  sideLinks: [],
  requestErrors: [],
  requestCount: 0,
  lastRequestTs: 0,
};

const mutations = {
  UPDATE_SIDE_LINKS(state, links) {
    state.sideLinks = links;
  },
  CLEAR_SIDE_LINKS(state) {
    state.sideLinks = [];
  },
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
  updateSideLinks({ commit }, links) {
    commit('UPDATE_SIDE_LINKS', links);
  },
  clearSideLinks({ commit }) {
    commit('CLEAR_SIDE_LINKS');
  },
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
