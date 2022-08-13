import Auth from '@/common/auth';
import { Route } from 'vue-router';
import router from './router';

import API from '@/API';
import auth from '@/common/auth';
import IAM from '@/common/iam';

const Utils = {
  /**
   * Returns a lazy-loaded Vue file for routing.
   * Be careful, using w/ router will still load before route guards kick in.
   * @param path Absolutely path to Vue file. `@/${path}.vue`
   */
  Load(path: string) {
    return () =>
      import(/* webpackChunkName: "view-[request]" */ `@/${path}.vue`);
  },

  /**
   * Blocks a route is environment is on `production`.
   */
  EnvProd(to: Route, from: Route, next: any): void {
    if (process.env.NODE_ENV === 'production') {
      next('/');
    } else {
      next({ to });
    }
  },

  /**
   * Blocks a route if vue environment is on `production`.
   */
  VueAppEnvProd(to: Route, from: Route, next: any): void {
    if (process.env.VUE_APP_ENV === 'production') {
      next('/');
    } else {
      next({ to });
    }
  },

  /**
   * Blocks a route if incorrect auth role.
   */
  CheckRole(to: Route, from: Route, next: any): void {
    let authorized = true;
    const mode = API.Organization_v2.getMode();
    if (mode === 'v2') {
      const activeOrg = API.Organization_v2.getActive();

      if ( to.name === 'Pipeline Settings' && !IAM.checkAuthz(['pipeline:list'], activeOrg)) {
        authorized = false;
      } else if ((
          to.name === 'Add Integrations' ||
          to.name === 'Edit Integrations' ||
          to.name === 'Integration Edit') &&
        !IAM.checkAuthz(['integration:write'], activeOrg)
      ) {
        authorized = false;
      }

    } else {
      if (to.name === 'Users' && !IAM.checkAuthz(['owner'])) {
        authorized = false;
      } else if (
        ( to.name === 'Insights' ||
          to.name === 'GovernancePolicies' ||
          to.name === 'Pipeline Settings' ||
          to.name === 'Add Integrations' ||
          to.name === 'Edit Integrations' ||
          to.name === 'Integration Edit') &&
        !IAM.checkAuthz(['admin'])
      ) {
        authorized = false;
      }
    }

    if (authorized) {
      next({ to });
    } else {
      next('/');
    }
  },

  /**
   * Checks for a valid local session
   * If not, attemps to parse the url for an auth callback hash
   * Then fetches necessary first time user data
   */
  async Setup(to: Route, from: Route, next: any): Promise<void> {
    Auth.validSession()
      .then(() => {
        /* Session is already valid, continue route */
        const setup = [
          API.Organization.sync(),
          API.Integration.syncDefinitions(),
        ];

        Promise.all(setup)
          .then((values) => {
            next({ to });
          })
          .catch((error) => {
            next();
            router.replace('/welcome');
            throw new Error(
              'Valid session, but organizations did not load in time'
            );
          });
      })
      .catch((error) => {
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
      });
  },


};

export default Utils;
