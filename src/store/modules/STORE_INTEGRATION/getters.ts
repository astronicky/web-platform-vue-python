import { getStoreAccessors } from 'vuex-typescript';
import { RootState } from '@/store/types';
import { StoreIntegrationState } from './types';

const { read } = getStoreAccessors<StoreIntegrationState, RootState>('STORE_INTEGRATION');

const getters = {
  getDefinitions: (state: StoreIntegrationState): IntegrationDefinition[] => state.integrationDefinitions,
};

export const getDefinitions = read(getters.getDefinitions);

export default getters;
