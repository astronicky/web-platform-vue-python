import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';

/**
 *                      Modules
 * STORE_ORGANIZATION - Sets user info on login/out, usually to localStorage
 * STORE_UI           - Manages all UI state. e.g. Spinners, modals, notifications
 */

import STORE_ORGANIZATION from './modules/STORE_ORGANIZATION';
import STORE_ORGANIZATIONv2 from './modules/STORE_ORGANIZATIONv2';
import STORE_INTEGRATION from './modules/STORE_INTEGRATION';
import STORE_UI from './modules/STORE_UI';
// @ts-ignore
import cognito from './modules/cognito';

import { RootState } from './types';

Vue.use(Vuex);

const options: StoreOptions<RootState> = {
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    STORE_ORGANIZATION,
    STORE_ORGANIZATIONv2,
    STORE_INTEGRATION,
    STORE_UI,
    cognito,
  },
};

export default new Vuex.Store(options);
