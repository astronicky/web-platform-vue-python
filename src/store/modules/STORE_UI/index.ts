/**
 * Cascadeo UI Module
 */

import { Module } from 'vuex';
import { RootState } from '@/store/types';
import { UIState } from './types';

import state from './state';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const STORE_UI: Module<UIState, RootState> = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};

export default STORE_UI;

export * from './actions';
export * from './getters';
