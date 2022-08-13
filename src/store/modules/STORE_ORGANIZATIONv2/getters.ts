import { getStoreAccessors } from 'vuex-typescript';
import { RootState } from '@/store/types';
import { StoreOrganizationState } from './types';
import { Ability } from '@casl/ability';

const { read } = getStoreAccessors<StoreOrganizationState, RootState>('STORE_ORGANIZATIONv2');

const getters = {
  getAll(state: StoreOrganizationState): Organization[] {
    return state.allOrgs;
  },
  getActive(state: StoreOrganizationState): Organization {
    return state.activeOrg;
  },
  getAccessible(state: StoreOrganizationState): object {
    return state.accessibleOrgs;
  },
  getAbilities(state: StoreOrganizationState): Ability<any> {
    return state.abilities;
  },
};

export const getAll = read(getters.getAll);
export const getActive = read(getters.getActive);
export const getAccessible = read(getters.getAccessible);
export const getAbilities = read(getters.getAbilities);

export default getters;
