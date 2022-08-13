import http from '@/common/http';
import BASE_URL from '@/common/http';
import API from '@/API';

const User = {
  async createUser(user: NewUser): Promise<any> {
    try {
      /**
       * Need to create a new `http` without the session validation interceptors
       * as this is an unvalidated call (not a real user, yet)
       */
      const https = http.create({
        baseURL: process.env.VUE_APP_API_BASE_V1,
      });

      const response = await https.post('users', {
        email: user.email,
        password: user.password,
        user_metadata: {
          welcome: 'true',
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  },
  async verifyInvite(id: string): Promise<string> {
    try {
      const response = await http.post(`/users/invite/verify?id=${id}`, {});
      const organization = JSON.parse(JSON.stringify(response.data));
      return organization.organization_id;
    } catch (error) {
      throw new Error('Invite not sent.');
    }
  },
  async v2_verifyInvite(id: string): Promise<string> {
    try {
      const baseUrl = process.env.VUE_APP_API_BASE_V1;
      const response = await fetch(
        `${baseUrl}/iam/organizations/invite/${id}/confirm`
      );

      if (response.status === 200) {
        const organization = await response.json();
        console.log(organization);
        return organization.organization_id;
      } else {
        throw new Error(response.statusText);
      }
    } catch (error) {
      throw new Error('Invite not sent.');
    }
  },
  async logUser(): Promise<void> {
    try {
      const organizationId = API.Organization_v2.getCurrentId();
      // only call if organization id is present.
      if (organizationId !== null || organizationId !== undefined) {
        await http.post(`/users/log?organization_id=${organizationId}`, {});
      }
      return;
    } catch (error) {
      throw new Error('Could not log user sign in..');
    }
  },
  async resetPassword(email: string): Promise<any> {
    try {
      const https = http.create({
        baseURL: process.env.VUE_APP_API_BASE_V1,
      });
      await https.post(`/users/reset/password`, { email });
      API.UI.addNotification({
        type: 'danger',
        text: 'Could not send reset password email.',
      });
    } catch (error) {
      API.UI.addNotification({
        type: 'primary',
        text: 'Could not send reset password email.',
      });
      throw new Error('Reset password not sent.');
    }
  },
  async inviteUser(email: string, role: string): Promise<any> {
    const organizationId = API.Organization_v2.getCurrentId();
    const local =
      location.hostname === 'localhost' || location.hostname === '127.0.0.1';
    try {
      await http.post(
        `/users/invite?organization_id=${organizationId}&local=${local}`,
        {
          email,
          role,
        }
      );

      API.UI.addNotification({
        type: 'primary',
        text: `Invite successfully sent to "${email}".`,
      });
    } catch (error) {
      API.UI.addNotification({
        type: 'danger',
        text: 'Invite could not be sent due to an error.',
      });
      throw new Error('Invite not sent.');
    }
  },
  async removeUser(user: User): Promise<any> {
    const organizationId = API.Organization_v2.getCurrentId();
    try {
      await http.delete(`/users/role?organization_id=${organizationId}`, {
        params: {
          organization_id: organizationId,
          user_id: user.user_id,
          user_email: user.email,
        },
      });

      API.UI.addNotification({
        type: 'primary',
        text: `Succesfully removed user "${user.email}".`,
      });
    } catch (error) {
      API.UI.addNotification({
        type: 'danger',
        text: 'Could not remove user due to an error.',
      });
      throw new Error('Role not updated.');
    }
  },
  async changeRole(userId: string, email: string, role: string): Promise<any> {
    const organizationId = API.Organization_v2.getCurrentId();
    try {
      await http.post(`/users/role?organization_id=${organizationId}`, {
        user_id: userId,
        email,
        role,
      });

      API.UI.addNotification({
        type: 'primary',
        text: `Succesfully changed role for "${email}" to "${role}".`,
      });
    } catch (error) {
      API.UI.addNotification({
        type: 'danger',
        text: 'Could not change role due to an error.',
      });
      throw new Error('Role not updated.');
    }
  },
  setUser(
    username: string,
    email: string,
    givenName: string,
    familyName: string
  ): void {
    localStorage.setItem('username', username);
    localStorage.setItem('email', email);
    localStorage.setItem('given_name', givenName);
    localStorage.setItem('family_name', familyName);
  },
  getUsername(): string {
    const user = localStorage.getItem('username');
    if (user === null || user === undefined) {
      throw new Error(`Username not defined.`);
    }
    return user;
  },
  getUserEmail(): string {
    const email = localStorage.getItem('email');
    if (email === null || email === undefined) {
      throw new Error(`Email not defined.`);
    }
    return email;
  },
  getGivenName(): string {
    const givenName = localStorage.getItem('given_name');
    if (givenName === null || givenName === undefined) {
      throw new Error(`Given name not defined.`);
    }
    return givenName;
  },
  getFamilyName(): string {
    const familyName = localStorage.getItem('family_name');
    if (familyName === null || familyName === undefined) {
      throw new Error(`Family name not defined.`);
    }
    return familyName;
  },

  async getUsers(): Promise<User[]> {
    const organizationId = API.Organization_v2.getCurrentId();
    try {
      const response = await http.get(`users`, {
        params: {
          organization_id: organizationId,
        },
      });
      const users = JSON.parse(JSON.stringify(response.data));
      return users;
    } catch (error) {
      API.UI.addNotification({
        type: 'danger',
        text: 'Error retrieving users.',
      });
      throw error;
    }
  },
};

export default User;
