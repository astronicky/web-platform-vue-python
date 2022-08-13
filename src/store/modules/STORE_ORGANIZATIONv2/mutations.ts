import { getStoreAccessors } from 'vuex-typescript';

import { RootState } from '@/store/types';
import { StoreOrganizationState } from './types';
import { Ability } from '@casl/ability';

const { commit } = getStoreAccessors<StoreOrganizationState, RootState>('STORE_ORGANIZATIONv2');

const mutations = {
  SET_ALL(state: StoreOrganizationState, orgList: Organization[]): void {
    state.allOrgs = orgList;
  },

  SET_ACTIVE(state: StoreOrganizationState, activeOrg: Organization): void {
    state.activeOrg = activeOrg;
  },

  SET_ACCESSIBLE(state: StoreOrganizationState, accessibleOrgs: UserOrganization[]): void {
    const orgs = accessibleOrgs.reduce((map, obj) => {
      map[obj.organization_id!] = obj;
      return map;
    }, {});

    state.accessibleOrgs = orgs;
  },

  SET_ABILITIES(state: StoreOrganizationState, abilities: Ability<any>): void {
    state.abilities = abilities;
  },
};

export const SET_ALL = commit(mutations.SET_ALL);
export const SET_ACTIVE = commit(mutations.SET_ACTIVE);
export const SET_ACCESSIBLE = commit(mutations.SET_ACCESSIBLE);
export const SET_ABILITIES = commit(mutations.SET_ABILITIES);

export default mutations;
