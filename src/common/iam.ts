import { Auth } from 'aws-amplify';
import store from '@/store/store';
import { Route } from 'vue-router';
import AuthLegacy from '@/common/auth';
import API from '@/API';
import Utils from '@/router/utils';
import router from '@/router/router';
import Permission from '@/API/IAM/Permission';

const env = (key: string) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Error: environment variable ${key} not defined`);
  }
  return value;
};

export default class Iam {
  public static signIn() {
    localStorage.clear();
    Auth.federatedSignIn();
  }

  public static async signOut() {
    localStorage.setItem('activeOrg', '');
    localStorage.setItem('orglist', '');
    await Auth.signOut();
    localStorage.clear();
  }

  public static async checkAuth(to: Route, from: Route, next: any) {
    const session = store.getters['cognito/session'];

    if (session === null) {
      Iam.signIn();
    } else {
      try {
        await Iam.validSession();
      } catch (error) {
        /* Invalid session */
        /**
         * If a route is requested, but the session is not valid, set the desired
         * route in local storage and check it on the auth callback, `/auth`.
         * Expiration is set for 1 hour.
         */
        if (window.location.pathname !== '/') {
          localStorage.setItem(
            'request_route_path',
            (window.location.pathname + location.search).substr(1)
          );
          localStorage.setItem(
            'request_route_expiry',
            String(Date.now() + 1000 * 60 * 60)
          );
        }
        /* Route to login */
        next('/login');
      }

      localStorage.setItem('mode', 'v2');

      const setup = [
        API.Organization_v2.sync(Iam.currentUser()),
        API.Integration.syncDefinitions(),
      ];

      try {
        await Promise.all(setup);
        next({ to });
      } catch (error) {
        next();
        router.replace('/welcome');
      }

      next({ to });
    }
  }

  public static async token() {
    return await store.dispatch('cognito/fetchJwtToken');
  }

  public static async validSession(refresh: boolean = false): Promise<string> {
    const iamToken = await Iam.token();
    return iamToken;
  }

  public static currentUser(): string {
    const session = store.getters['cognito/session'];
    return session.accessToken.payload.username;
  }

  public static currentUserEmail(): string {
    const session = store.getters['cognito/session'];
    return session.idToken.payload.email;
  }

  // TODO: remove any after migration
  public static checkAuthz(
    requiredScope: string[],
    organization?: Organization | any
  ): boolean {
    // TODO: remove me. for backwards compatibility.
    const mode = localStorage.getItem('mode');
    if (mode !== 'v2') {
      // requiredScope is equivalent to requiredRole in v1 (admin|owner|user)
      return AuthLegacy.checkRole(requiredScope[0]);
    }

    if (organization === undefined) {
      throw Error('organization cannot be undefined');
    }

    return Permission.userCan(requiredScope, organization);
  }

  public static init() {
    Auth.configure({
      region: env('VUE_APP_AWS_REGION'),
      userPoolId: env('VUE_APP_USER_POOL_ID'),
      userPoolWebClientId: env('VUE_APP_USER_POOL_CLIENT_ID'),
      oauth: {
        domain: env('VUE_APP_HOSTED_UI_DOMAIN'),
        scope: ['openid', 'email'],
        redirectSignIn: env('VUE_APP_COGNITO_REDIRECT_URI'),
        redirectSignOut: env('VUE_APP_COGNITO_REDIRECT_URI'),
        responseType: 'code',
      },
    });
  }
}
