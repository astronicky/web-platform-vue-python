import http from '@/common/http';

const Role = {
  async getAll(organizationID: string, includeInternal: boolean): Promise<Role[]> {
    const response = await http.get(`iam/roles`, { params: {
      organization_id: organizationID,
      include_internal: includeInternal,
    }});
    return response.data;
  },
  async get(roleID: string): Promise<Role> {
    const response = await http.get(`iam/roles/${roleID}`);
    return response.data;
  },
  async add(role: Role): Promise<Role> {
    const response = await http.put(`iam/roles`, role);
    return response.data;
  },
  async delete(roleID: string): Promise<Role> {
    const response = await http.delete(`iam/roles/${roleID}`);
    return response.data;
  },
  async getSearchRole(searchText: string = '', organizationID: string): Promise<any> {
    const response = await http.get(`iam/roles`, { params: {
      organization_id: organizationID,
      include_internal: true,
    }});
    const roles =  response.data;
    if (searchText === '') {
      return roles;
    }
    const searchResult: Userv2[] = [];
    const lowerSearchText: string = searchText.toLowerCase();
    roles.forEach((value) => {
      if (value.name.toLowerCase().includes(lowerSearchText)) {
        searchResult.push(value);
      }
    });
    return searchResult;
  },
};
export default Role;
