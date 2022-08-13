import { StoreOrganizationState } from './types';
import { Ability } from '@casl/ability';

const state: StoreOrganizationState = {
  allOrgs: [],
  activeOrg: {
    id: '',
    name: '',
    description: '',
    order_by: 0,
  },
  accessibleOrgs: {},
  abilities: new Ability<any>([]),
};

export default state;
