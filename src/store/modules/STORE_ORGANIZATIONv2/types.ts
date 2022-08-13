import { Ability } from '@casl/ability';

/* tslint:disable-next-line:no-empty-interface */
export interface StoreOrganizationState {
  allOrgs: Organization[];
  activeOrg: Organization;

  // hash of organizations where a logged in user has access to
  // this is mainly used to quickly check if a user has access to an organization
  // without checking fine-s permission
  accessibleOrgs: object;

  abilities: Ability<any>;
}
