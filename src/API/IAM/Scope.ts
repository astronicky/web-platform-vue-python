import http from '@/common/http';

const Scope = {
  async getScopes(): Promise<Scope[]> {
    const response = await http.get(`iam/scopes`);
    return response.data;
  },
};
export default Scope;
