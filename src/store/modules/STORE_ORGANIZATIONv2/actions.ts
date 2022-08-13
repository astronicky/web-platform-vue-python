import { ActionContext, Action } from 'vuex';
import { getStoreAccessors } from 'vuex-typescript';
import { Ability } from '@casl/ability';

import { RootState } from '@/store/types';
import { StoreOrganizationState } from './types';

import * as STORE_ORGANIZATION from './mutations';

const { dispatch } = getStoreAccessors<StoreOrganizationState, RootState>('STORE_ORGANIZATIONv2');
type StoreOrganizationContext = ActionContext<StoreOrganizationState, RootState>;

const actions = {
  setAll(context: StoreOrganizationContext, orgList: Organization[]): void {
    STORE_ORGANIZATION.SET_ALL(context, orgList);
  },

  setActive(context: StoreOrganizationContext, activeOrg: Organization): void {
    STORE_ORGANIZATION.SET_ACTIVE(context, activeOrg);
  },

  setAccessible(context: StoreOrganizationContext, accessibleOrgs: UserOrganization[]): void {
    STORE_ORGANIZATION.SET_ACCESSIBLE(context, accessibleOrgs);
  },

  setAbilities(context: StoreOrganizationContext, abilities: Ability<any>): void {
    STORE_ORGANIZATION.SET_ABILITIES(context, abilities);
  },
};


export const setAll = dispatch(actions.setAll);
export const setActive = dispatch(actions.setActive);
export const setAccessible = dispatch(actions.setAccessible);
export const setAbilities = dispatch(actions.setAbilities);

export default actions;
