// @ts-ignore
import { Auth, Hub } from 'aws-amplify';

export default {
  namespaced: true,
  state: {
    user: null,
  },
  getters: {
    session: (state: any) => state.user && state.user.signInUserSession,
  },
  mutations: {
    setUser: (state: any, user: any) => {
      state.user = user;
    },
  },
  actions: {
    init: async ({ commit, dispatch }) => {
      // listen for auth change events and update store
      Hub.listen('auth', ({ payload: { event } }) => {
        switch (event) {
          case 'signIn':
            dispatch('fetchSession');
            break;
          case 'signIn_failure':
          case 'signOut':
            commit('setUser', null);
            break;
        }
      });
      await dispatch('fetchSession');
    },
    fetchSession: async ({ commit }) => {
      const session = await Auth.currentSession();
      const user = await Auth.currentUserPoolUser();
      commit('setUser', user);
      return session;
    },
    fetchJwtToken: async ({ dispatch }) => {
      const session = await dispatch('fetchSession');
      return session.getAccessToken().getJwtToken();
    },
  },
};
