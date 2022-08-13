import { getStoreAccessors } from 'vuex-typescript';

import { RootState } from '@/store/types';
import { StoreOrganizationState } from './types';

const { commit } = getStoreAccessors<StoreOrganizationState, RootState>('STORE_ORGANIZATION');

const mutations = {
  SET_ALL(state: StoreOrganizationState, orgList: Org[]): void {
    state.allOrgs = orgList;
  },
};

export const SET_ALL = commit(mutations.SET_ALL);

export default mutations;
