import http from '@/common/http';
import router from '@/router/router';
import Auth from '@/common/auth';
import store from '@/store/store';
import { Ability, RawRuleOf, ForcedSubject } from '@casl/ability';

import Iam from '@/common/iam';
import API from '@/API';
import { type } from 'os';
import * as STORE_ORGANIZATIONv2 from '@/store/modules/STORE_ORGANIZATIONv2';

const Organization = {
  getMode(): string|null {
    return localStorage.getItem('mode');
  },
  getCurrentId(): string {
    // TODO: backwards compatibility. remove me when migrated to v2
    const mode = this.getMode();
    if (mode !== 'v2' ) {
      return API.Organization.getCurrentId();
    }

    return this.getActive().id || '';
  },
  getCurrentName(): string {
    // Return org.name if v2, org.id if v1 or not given
    const mode = this.getMode();
    if (mode !== 'v2' ) {
      return API.Organization.getCurrentId();
    }

    return this.getActive().name || '';
  },
  getPartnerOrgs() {
    const organizations = this.getLocalPartnerOrgList();
    let partnerOrgs: PartnerOrganizationList[] = [{
      id: '',
      name: '',
    }, {
      id: '520a4dc6-4831-11ec-81d3-0242ac130003',
      name: 'Cascadeo',
    }];
    for (const organization of organizations) {
      partnerOrgs = partnerOrgs.concat([{
        id: organization.id,
        name: organization.name,
      }]);
    }
    return partnerOrgs;
  },
  async updatePartnerOrg(organizationId: string, partnerId: string): Promise<boolean> {
    try {
      const response = await http.put(`iam/organizations/${organizationId}/partner?id=${partnerId}`);
    } catch (err) {
        API.UI.addNotification({
          type: 'danger',
          text: `Partner Organization could not be updated. ${err}`,
        });
        return false;
    }
    API.UI.addNotification({
      type: 'primary',
      text: `Successfully updated partner organization`,
    });
    return true;
  },
  async get(organizationID: string | undefined): Promise<Organization|undefined> {
    try {
      const response = await http.get(`iam/organizations/${organizationID}`);

      return response.data;
    } catch (error) {
      API.UI.addNotification({
        type: 'danger',
        text: `Could not get organization. Error: ${error}`,
      });
    }
  },
  async getOrgTree(organizationID: string): Promise<Organization[]> {
    try {
      const response = await http.get(`iam/organizations/${organizationID}/tree`);

      return response.data;
    } catch (error) {
      API.UI.addNotification({
        type: 'danger',
        text: `Could not get organization. Error: ${error}`,
      });
      return [];
    }
  },
  async update(organization: Organization): Promise<boolean> {
    try {
      const response = await http.put(`iam/organizations`, organization);
    } catch (err) {
        API.UI.addNotification({
          type: 'danger',
          text: `Organization could not be added. ${err}`,
        });
        return false;
    }
    API.UI.addNotification({
      type: 'primary',
      text: `Successfully updated organization`,
    });
    this.sync(Iam.currentUser());
    return true;
  },
  async deleteOrg(orgId: string): Promise<any> {
    try {
      const response = await http.delete(`iam/organizations/${orgId}`);
      const active = this.getActive();
      // unset active org
      if (active.id === orgId) {
        this.setActive({id: '', name: '', description: ''});
      }
      return response;
    } catch (err) {
      if (err.message === 'Request failed with status code 400' || err.message === 'Request failed with status code 403') {
        API.UI.addNotification({
          type: 'danger',
          text: 'Organization currently has active child organizations. Please move child organizations to a different parent, or delete before removing this organization.',
        });
      } else {
        API.UI.addNotification({
          type: 'danger',
          text: 'Organization could not be deleted.',
        });
      }
    }
  },
  async deleteUserFromOrg(userId: string, orgId: string): Promise<boolean> {
    try {
      // console.log("User ID:", userId)
      // console.log("Org ID:", orgId)
      await http.delete(`iam/user/${userId}/organizations?org_id=${orgId}`);
      return true;
    } catch (err) {
      // console.log(err.message)
      API.UI.addNotification({
        type: 'danger',
        text: 'Could not remove user.',
      });
    }

    return false;
  },
  async addOrganization(organization: Organization): Promise<any> {
    organization.is_active = true;
    // To-Do set order_by to length of current list
    organization.order_by = 2;
    if (!organization.type) {
      if (organization.parent_id) {
        organization.type = 'child';
      } else {
        organization.type = 'root';
      }
    }
    // this.sync(Iam.currentUser());
    return http.put(`iam/organizations`, organization);
  },
  async getAllOrganizationTree(partnerOrgId: string): Promise<any> {
    // Used in admin portal
    try {
      const response = await http.get(`/iam/organizations/tree?nested=true&partner_org=${partnerOrgId}`);
      this.setLocalPartnerOrgs(response.data);
      return response.data;
    } catch (err) {
      API.UI.addNotification({
        type: 'danger',
        text: 'Could not get organization tree',
      });
    }
  },
  async getUserOrgTree(userID: string, searchText: string = '', nested: boolean = true, recursive: boolean = true): Promise<any> {
    const response = await http.get(`/iam/user/${userID}/organizations`, {
      params: {
        nested,
        recursive,
      },
    });
    const organizations =  response.data;
    if (searchText === '') {
      return organizations;
    }
    let searchResult: Organization[] = [];
    const lowerSearchText: string = searchText.toLowerCase();
    organizations.forEach((value) => {
      if (value.name.toLowerCase().includes(lowerSearchText) || value.description.toLowerCase().includes(lowerSearchText)) {
        searchResult.push(value);
      }
      if (value.children) {
        searchResult = this.searchChildOrgByKeyword(value.children, lowerSearchText, searchResult);
      }
    });
    return searchResult;
  },
  async getUserTree(searchText: string = ''): Promise<any> {
    const response = await http.get(`/iam/user`);
    const organizations =  response.data;
    if (searchText === '') {
      return organizations;
    }
    const searchResult: Userv2[] = [];
    const lowerSearchText: string = searchText.toLowerCase();
    organizations.forEach((value) => {
      if (value.name.toLowerCase().includes(lowerSearchText) || value.email.toLowerCase().includes(lowerSearchText)) {
        searchResult.push(value);
      }
    });
    return searchResult;
  },
  searchChildOrgByKeyword(Organizations: Organization[], searchText: string, searchResult: Organization[]): Organization[] {
    Organizations.forEach((children) => {
      if (children.name.toLowerCase().includes(searchText) || children.description.toLowerCase().includes(searchText)) {
        searchResult.push(children);
      }
      if (children.children) {
        searchResult = this.searchChildOrgByKeyword(children.children, searchText, searchResult);
      }
    });
    return searchResult;
  },
  async addUser(userOrganization: UserOrganization): Promise<any> {
    const response = await http.put(`/iam/organizations/users`, userOrganization);
    return response.data;
  },
  async InviteUser(userOrganization: UserOrganization, organization_id: string): Promise<any> {
    const response = await http.post(`/iam/organizations/${organization_id}/invite`, userOrganization);
    return response.data;
  },
  // local store

  getAll(): Organization[] {
    return STORE_ORGANIZATIONv2.getAll(store);
  },
  getAccessible(): object {
    return STORE_ORGANIZATIONv2.getAccessible(store);
  },
  getActive(): Organization {
    const activeOrgString = localStorage.getItem('activeorg');
    if (activeOrgString) {
      return JSON.parse(activeOrgString);
    }
    return {id: '', name: '', description: ''};
  },
  getLocalPartnerOrgList(): Organization[] {
    const orgs = localStorage.getItem('partnerOrglist');
    if (orgs) {
      return JSON.parse(orgs);
    }
    return [];
  },

  deleteActive(): void {
    localStorage.removeItem('activeOrg');
  },

  setAll(orgList: Organization[]): void {
    localStorage.setItem('orglist', JSON.stringify(orgList));
    STORE_ORGANIZATIONv2.setAll(store, orgList);
  },
  setLocalPartnerOrgs(orgList: Organization[]): void {
    let partnerOrgs: Organization[] = [];
    orgList.forEach((org) => {
      if (org.type === 'partner') {
        partnerOrgs = partnerOrgs.concat(org);
      }
    });
    localStorage.setItem('partnerOrglist', JSON.stringify(partnerOrgs));
  },

  setActive(activeOrg: Organization): void {
    const org = JSON.parse(JSON.stringify(activeOrg));
    delete org.children;
    localStorage.setItem('activeorg', JSON.stringify(org));
  },

  setAccessible(accessibleOrgs: UserOrganization[]): void {
    if (accessibleOrgs === null) {
      accessibleOrgs = [];
    }
    STORE_ORGANIZATIONv2.setAccessible(store, accessibleOrgs);
  },

  updateDB(orgList: Organization[]): void {
    // TODO: put iam/organizations with order_by when schema has been updated
    // console.log('check order', orgList);
     http.put(`iam/organizations/batch`, orgList);
  },

  /**
   * Fetches Organziation from database and adds them to local
   * client store, "syncing" front and back end.
   */
  async sync(userID: string, nested: boolean = true, recursive: boolean = true): Promise<void> {
    try {
      const res = await Promise.all([
          http.get(`/iam/user/${userID}/organizations`, {
            params: {
              nested: true,
              recursive: true,
            },
          }),
          http.get(`/iam/user/${userID}/organizations`, {
            params: {
              nested: false,
              recursive: false,
            },
          }),
      ]);

      this.setAccessible(res[1].data);
      let active = this.getActive();
      let organizations = res[0].data;
      const accessibleOrgs = this.getAccessible();
      organizations = this.sort(organizations);

      if (active.id === '') {
        if (organizations.length > 0) {
          // if the local active org is empty
          // get the nearest accessible org by id
          // set new active org
          for (const i in organizations) {
            if (accessibleOrgs[organizations[i].id!]) {
              active = organizations[i];
              break;
            }
          }

          // if user has no access to parent orgs, sweep to child orgs
          if (active.id === '') {
            let nearestOrgId;
            for (const x of Object.keys(accessibleOrgs)) {
              if (accessibleOrgs[x].organization_id) {
                nearestOrgId = accessibleOrgs[x].organization_id;
                break;
              }
            }
            active = this.find(nearestOrgId, organizations)!;
          }
        }
      }
      this.setActive(active);

      if (Object.keys(accessibleOrgs).length > 0 ) {
        // case : refresh or add new org
        const activeIndex = organizations.findIndex((el) => el.id === active.root_id);
        const rootOfSelected = organizations.splice(activeIndex, 1);
        organizations.unshift(rootOfSelected[0]);
        await this.setUserPermissions(active.id!, userID);
      }

      this.setAll(organizations);
      Iam.validSession(true);
      console.log('Local sync.');
    } catch (error) {
      throw new Error('Cannot sync organizations list.');
    }
  },
  sort(organizations: Organization[] | undefined): Organization[] {
    const sorted = [];
    for (const i in organizations) {
      if (organizations[i].children === undefined) {
        continue;
      }
      organizations[i].children = this.sort(organizations[i].children);
    }

    if (organizations === undefined) {
      organizations = [];
    }

    return organizations.sort((a, b) => {
      const nameA = a.name.toUpperCase();
      const nameB = b.name.toUpperCase();
      if (nameA < nameB) { return -1; }
      if (nameA > nameB) { return 1; }
      return 0;
    });
  },
  flatten(organizations: Organization[], prefix: string = '', enabledID: string[], excludeID: string[] = []): Array<{label: string, id: string, enabled: boolean}> {
    // Flatten and add prefix to orgname to show hierarchy
    let flat: Array<{label: string, id: string, enabled: boolean}> = [];
    for (const organization of organizations) {
      if (excludeID.indexOf(organization.id!) >= 0) {
        // Do not include in list
        continue;
      }

      let enabled = true;
      if (enabledID.indexOf(organization.id!) < 0) {
        enabled = false;
      }

      const children = organization.children || [];
      const name = `${prefix}${organization.name}`;
      if (children.length === 0) {
        flat.push({label: name, id: organization.id!, enabled});
      } else {
        flat = [...flat, {label: name, id: organization.id!, enabled}, ...this.flatten(children, prefix.trim() + '-- ', enabledID, excludeID)];
      }
    }
    return flat;
  },
  find(organizationID: string, organizations: Organization[]): Organization|undefined {
    // TODO: create index for faster find

    for (const organization of organizations) {
      if ( organization.id === organizationID ) {
        return organization;
      }

      const children = organization.children || [];
      const found = this.find(organizationID, children);

      if (found) {
        return found;
      }
    }
  },
  getNodeTree(organizations: Organization[], organizationID: string): Organization|undefined {
    let found: Organization|undefined;
    for (const organization of organizations) {
      if (organization.id === organizationID) {
        return organization;
      }

      const children = organization.children || [];
      if (children.length !== 0) {
        found = this.getNodeTree(children, organizationID);
      }

      if (found !== undefined) {
        return found;
      }
    }
  },
  async getUsers(organizationID: string): Promise<UserOrganization[]> {
    if (organizationID) {
      const response = await http.get(`iam/organizations/${organizationID}/users`);
      if (response.data === undefined) {
        throw Error('response is undefined');
      }
      return response.data;
    } else {
      return [];
    }
  },
  async getAllUsers(limit: string): Promise<Userv2[]> {
    const response = await http.get(`iam/user?limit=${limit}`);
    if (response.data === undefined) {
      throw Error('response is undefined');
    }
    return response.data;
  },

  // style API
    orgShortName(item: Organization): string {
      // const org = this.organizations;
    let orgName: string[] = [];
    /* Regex splits on ' ', '-', and '_' into words in Array */

    /* Use org id instead */
    orgName = item.name.split(/[-_\s]/, 2);


    if (orgName.length >= 2) {
      /* There are 2 words, first letter of each */
      return `${orgName[0].substring(0, 1)}${orgName[1].substring(0, 1)}`;
    } else {
      /* There is only 1 or 0 words */
      if (orgName[0].length === 1) {
        /* 1 word / 1 letter, just take 1 letter */
        return orgName[0].substring(0, 1);
      }
      return orgName[0].substring(0, 2); /* 1 word, take first 2 letters */
    }
  },

  stringToHash(id: string): object {
    /* tslint:disable:no-bitwise */
    let hash: number = 0;
    if (id.length === 0) {
      hash = 0;
    }
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
      hash = hash & hash; // Convert to 32bit integer
    }
    hash = hash % 360;
    return {
      border: `.05rem solid hsl(${hash},95%,30%)`,
      background: `hsl(${hash},95%,80%)`,

    };
  },
  async setUserPermissions(organizationID: string, userID: string) {
    const abilities = await this.getOrgPermissions(organizationID, userID);
    STORE_ORGANIZATIONv2.setAbilities(store, abilities);
    console.log('Set permission locally');
  },
  getCurrentOrgPermissions(): Ability<any> {
    // Get user's permissions to currently selected org from local state
    return STORE_ORGANIZATIONv2.getAbilities(store);
  },
  async getOrgPermissions(organizationID: string, userID: string): Promise<Ability<any>> {
    // Get user's permission to given organizationID from api
    const actions = ['*:*'] as const;
    const subjects = ['Organization', 'all'] as const;

    type Abilities = [
      typeof actions[number],
      typeof subjects[number] | ForcedSubject<Exclude<typeof subjects[number], 'all'>>
    ];

    type AppAbility = Ability<Abilities>;

    const response = await http.get(`iam/user/${userID}/permissions/${organizationID}?format=casl`);
    const rules = response.data;

    return new Ability<Abilities>(rules);
  },
  async updateOrgStatus(orgId: string, status: boolean): Promise<any> {
    try {
      const response = await http.put(`iam/organizations/admin/updateOrgStatus?organization_id=${orgId}&status=${status}`);
    } catch (err) {
        API.UI.addNotification({
          type: 'danger',
          text: `Organization status could not be updated. ${err}`,
        });
        return false;
    }
    API.UI.addNotification({
      type: 'primary',
      text: `Successfully updated organization status`,
    });
    this.sync(Iam.currentUser());
    return true;
  },
};
export default Organization;


