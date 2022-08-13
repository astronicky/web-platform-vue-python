import { getStoreAccessors } from 'vuex-typescript';
import { RootState } from '@/store/types';
import { StoreOrganizationState } from './types';

const { read } = getStoreAccessors<StoreOrganizationState, RootState>('STORE_ORGANIZATION');

const getters = {
  getAll(state: StoreOrganizationState): Org[] {
    return state.allOrgs;
  },
  getCurrentId(state: StoreOrganizationState): string {
    return state.allOrgs[0].organization_id;
  },
};

export const getAll = read(getters.getAll);
export const getCurrentId = read(getters.getCurrentId);

export default getters;
