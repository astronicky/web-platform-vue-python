import { getStoreAccessors } from 'vuex-typescript';

import { RootState } from '@/store/types';
import { StoreIntegrationState } from './types';

const { commit } = getStoreAccessors<StoreIntegrationState, RootState>('STORE_INTEGRATION');

const mutations = {
  SET_DEFINITIONS(state: StoreIntegrationState, definitions: IntegrationDefinition[]): void {
    state.integrationDefinitions = definitions;
  },
};

export const SET_DEFINITIONS = commit(mutations.SET_DEFINITIONS);

export default mutations;
