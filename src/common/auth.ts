import Auth0 from 'auth0-js';
import { Route } from 'vue-router';

import router from '@/router/router';
import store from '@/store/store';

import API from '@/API';

class Auth {
  private webAuth: Auth0.WebAuth;

  constructor() {
    this.webAuth = new Auth0.WebAuth({
      domain: process.env.VUE_APP_AUTH0_DOMAIN || '',
      clientID: process.env.VUE_APP_AUTH0_CLIENT || '',
      redirectUri: `${process.env.VUE_APP_REDIRECT_URI}/auth` || '',
      audience: process.env.VUE_APP_AUTH0_AUDIENCE || '',
      responseType: 'token id_token',
      scope: 'openid profile',
    });
  }

  /**
   * Redirects to Cascadeo's hosted login on Auth0 service.
   */
  public login(): void {
    this.webAuth.authorize();
  }

  /**
   * Clears local sessions data and session on Auth0 service
   */
  public logout(): void {
    localStorage.clear();

    this.webAuth.logout({
      returnTo: process.env.VUE_APP_REDIRECT_URI || '',
    });
  }
  /**
   * Extracts and sets session details to localStorage via store
   *
   * @param result - Accepts an Auth0 auth result
   */
  public async setLocalSession(result: Auth0.Auth0DecodedHash): Promise<void> {
    const { expiresIn, accessToken, idToken } = result;

    const username = result.idTokenPayload.nickname;
    const email = result.idTokenPayload.name;
    const roles = result.idTokenPayload['http://cascadeo.io/roles'];

    /* Might not be set due to old sign up not requiring names */
    const givenName = result.idTokenPayload.given_name || '';
    const familyName = result.idTokenPayload.family_name || '';

    /* Set the time that the access token will expire at */
    let expiresAt: number;
    if (expiresIn) {
      expiresAt = expiresIn * 1000 + new Date().getTime();
    } else {
      throw new Error('Auth result expiry is undefined');
    }

    if (!expiresIn || !accessToken || !idToken) {
      throw new Error('No auth hash decoded token');
    }

    /* Set userdata return from auth provider */
    API.User.setUser(username, email, givenName, familyName);

    if (
      API.Organization.getCurrentId() !== '' &&
      API.Organization.getCurrentId() !== null
    ) {
      // TODO: IOP-1162. Re-instate for iam v2
      const mode = localStorage.getItem('mode');
      if (mode !== 'v2') {
        await API.User.logUser();
      }
    }
    // TODO: set `analytics` here and then call the Vue.use(VueGTM) after

    /* Set tokens via store, also reset api default headesr with new key */
    localStorage.setItem('access_token', String(accessToken));
    localStorage.setItem('id_token', String(idToken));
    localStorage.setItem('expires_at', String(expiresAt));
    localStorage.setItem('roles', roles.join(','));
  }

  /**
   * Checks to see if a local token has expired.
   * Calls Auth0 to see if a session is valid even if the token is expired.
   * @returns {string} Valid Auth0 bearer token
   */
  public async validSession(refresh: boolean = false): Promise<string> {
    return new Promise((resolve, reject) => {
      const { accessToken, expiresAt } = this.getSession();
      const tokenNotExpired: boolean =
        accessToken !== undefined &&
        expiresAt !== undefined &&
        new Date().getTime() < expiresAt;

      if (tokenNotExpired && !refresh) {
        resolve(accessToken);
      } else {
        this.webAuth.checkSession({}, async (_, res) => {
          if (res) {
            await this.setLocalSession(res);
            resolve(res.accessToken);
          } else {
            reject('Session could not be validated.');
          }
        });
      }
    });
  }

  /**
   * Checks to see if session info is in the URL and tries to parse it.
   * @returns An authResult
   */
  public parseUrl(): Promise<Auth0.Auth0DecodedHash> {
    return new Promise((resolve, reject) => {
      this.webAuth.parseHash((err, authResult) => {
        if (authResult) {
          resolve(authResult);
        } else {
          reject(err);
        }
      });
    });
  }

  public getSession(): UserSession {
    const accessToken = localStorage.getItem('access_token') || undefined;
    const idToken = localStorage.getItem('id_token') || undefined;
    const expiresAt = Number(localStorage.getItem('expires_at')) || undefined;
    const roles = localStorage.getItem('roles') || undefined;

    return {
      accessToken,
      idToken,
      expiresAt,
      roles,
    };
  }

  public isRole(role: string): boolean {
    const organizationId = API.Organization_v2.getCurrentId();
    const session = this.getSession();

    if (organizationId !== undefined && session.roles !== undefined) {
      return session.roles.includes(`${organizationId}|${role}`);
    }
    return false;
  }

  public isAdmin(): boolean {
    return this.isRole('admin');
  }

  public isOwner(): boolean {
    return this.isRole('owner');
  }

  public isUser(): boolean {
    return this.isRole('user');
  }

  public checkRole(role: string): boolean {
    const userRole = this.isRole('user');
    const adminRole = this.isRole('admin');
    const ownerRole = this.isRole('owner');

    if (role === 'user') {
      return userRole || adminRole || ownerRole;
    }

    if (role === 'admin') {
      return adminRole || ownerRole;
    }

    return ownerRole;
  }
}

export default new Auth();
