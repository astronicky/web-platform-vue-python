import http from '@/common/http';
import { subject, Ability } from '@casl/ability';
import API from '@/API';

const Permission = {
  async add(permission: Permission): Promise<any> {
    const response = await http.put(`iam/permissions`, permission);
    return response.data;
  },
  async delete(permission: Permission): Promise<any> {
    const scope = encodeURIComponent(permission.scope);
    const action = encodeURIComponent(permission.action);
    const role_id = encodeURIComponent(permission.role_id);
    const url = `iam/permission/${role_id}/${scope}/${action}`;

    const response = await http.delete(url);

    return response.data;
  },
  userCan(scope: string[], organization: Organization): boolean {
    const abilities = API.Organization_v2.getCurrentOrgPermissions();
    return this.userCanWithAbilities(abilities, scope, organization);
  },
  userCanWithAbilities(abilities: Ability<any>, scope: string[], organization: Organization): boolean {
    for (const s of scope) {
      if (!abilities.can(s, subject('Organization', organization))) {
        return false;
      }
    }
    return true;
  },
};
export default Permission;
