import { ActionContext } from 'vuex';
import { getStoreAccessors } from 'vuex-typescript';

import { RootState } from '@/store/types';
import { StoreIntegrationState } from './types';

import * as STORE_INTEGRATION from './mutations';

const { dispatch } = getStoreAccessors<StoreIntegrationState, RootState>('STORE_INTEGRATION');
type IntegrationContext = ActionContext<StoreIntegrationState, RootState>;

const actions = {
  setDefinitions(context: IntegrationContext, definitions: IntegrationDefinition[]): void {
    STORE_INTEGRATION.SET_DEFINITIONS(context, definitions);
  },
};

export const setDefinitions = dispatch(actions.setDefinitions);

export default actions;
