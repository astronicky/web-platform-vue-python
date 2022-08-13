/**
 * Cascadeo UI Module
 */

import { Module } from 'vuex';
import { RootState } from '@/store/types';
import { StoreIntegrationState } from './types';

import state from './state';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const STORE_INTEGRATION: Module<StoreIntegrationState, RootState> = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};

export default STORE_INTEGRATION;

export * from './actions';
export * from './getters';
