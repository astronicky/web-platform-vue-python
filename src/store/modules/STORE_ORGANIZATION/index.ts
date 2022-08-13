/**
 * Cascadeo STORE_ORGANIZATION Module
 */

import { Module } from 'vuex';
import { RootState } from '@/store/types';
import { StoreOrganizationState } from './types';

import state from './state';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const STORE_ORGANIZATION: Module<StoreOrganizationState, RootState> = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};

export default STORE_ORGANIZATION;

export * from './actions';
export * from './getters';
