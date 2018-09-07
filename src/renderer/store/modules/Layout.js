const state = {
  sideLinks: [],
};

const mutations = {
  UPDATE_SIDE_LINKS(state, links) {
    state.sideLinks = links;
  },
  CLEAR_SIDE_LINKS(state) {
    state.sideLinks = [];
  },
};

const actions = {
  updateSideLinks({ commit }, links) {
    commit('UPDATE_SIDE_LINKS', links);
  },
  clearSideLinks({ commit }) {
    commit('CLEAR_SIDE_LINKS');
  },
};

export default {
  state,
  mutations,
  actions,
};
