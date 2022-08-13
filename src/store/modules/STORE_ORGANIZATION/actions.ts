import { ActionContext, Action } from 'vuex';
import { getStoreAccessors } from 'vuex-typescript';

import { RootState } from '@/store/types';
import { StoreOrganizationState } from './types';

import * as STORE_ORGANIZATION from './mutations';

const { dispatch } = getStoreAccessors<StoreOrganizationState, RootState>('STORE_ORGANIZATION');
type StoreOrganizationContext = ActionContext<StoreOrganizationState, RootState>;

const actions = {
  setAll(context: StoreOrganizationContext, orgList: Org[]): void {
    STORE_ORGANIZATION.SET_ALL(context, orgList);
  },
};

export const setAll = dispatch(actions.setAll);

export default actions;
