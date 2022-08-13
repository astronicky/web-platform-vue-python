import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import Notifications from 'vue-notification';

import App from './App.vue';
import router from './router/router';
import store from './store/store';

import VueGtm from 'vue-gtm';
import VueMoment from 'vue-moment';
import './common/filters';
import Iam from '@/common/iam';
import Permission from '@/API/IAM/Permission';

/**
 * Import global components
 */
import '@/components';

/**
 * Import global styles
 */
import '@/styles/flexboxgrid3.css';
import '@/styles/style.scss';

/**
 * Import echarts
 */
// import '@/plugins/echarts';

/**
 * Vee Validate
 */
import '@/common/validate';

/**
 * Production flags
 */
Vue.config.productionTip = false;

/**
 * Toash Notifications
 */
Vue.use(Notifications);

/**
 * Google Tag Manager (GTM)
 */

/* flag for turning off debug in `production` and `demo`. */
// TODO: eventually have debug on GTM be only for local
const gtmActive =
  process.env.VUE_APP_ENV === 'production' ||
  process.env.VUE_APP_ENV === 'staging';

Vue.use(VueGtm, {
  id: 'GTM-NDN3PBP', // Your GTM ID
  enabled: gtmActive, // defaults to true. Can be disabled by setting this to false for Ex: enabled: !!GDPR_Cookie
  debug: false, // Whether or not display console logs debugs (optional)
  vueRouter: router, // Pass the router instance to automatically sync with router (optional)
  ignoredViews: [], // If router, you can exclude some routes name (case insensitive) (optional)
});

Vue.use(BootstrapVue);
Vue.use(VueMoment);

Vue.mixin({
  methods: {
    userCan: Permission.userCan,
    userCanWithAbilities: Permission.userCanWithAbilities,
  },
});

// iam
Iam.init();

/**
 * Vue init
 */

const mode = localStorage.getItem('mode');
if (window.location.pathname.startsWith('/v2')) {
  console.log('init v2');
  /**
   * We need this hack to get around an issue w/ amplify
   * amplify strips and 'code' or 'error' parameters and redirects to the roor
   * we need to replace params i.e, 'id' so amplify does not do this strip
   * if they are not strip it will properly route the slack add view
   */
  const search = window.location.search.toLowerCase();
  const slackPath = '/v2/integrations/add/slack';
  if (
    window.location.pathname.startsWith(slackPath) &&
    (search.includes('code') || search.includes('error'))
  ) {
    window.location.search = search.replace('code', 'id');
  }

  if (mode === 'v1') {
      new Vue({
        router,
        store,
        render: (h) => h(App),
      }).$mount('#app');
      router.replace('/');
  } else {
      store
        .dispatch('cognito/init')
        .catch((err) => console.log('cognito/init err:', err))
        .finally(() => {
          new Vue({
            router,
            store,
            render: (h) => h(App),
          }).$mount('#app');
        });
  }
} else {
  console.log('init v1');

  if (mode === 'v2') {
    store
      .dispatch('cognito/init')
      .catch((err) => console.log('cognito/init err:', err))
      .finally(() => {
        new Vue({
          router,
          store,
          render: (h) => h(App),
        }).$mount('#app');
      });
  } else {
    new Vue({
      router,
      store,
      render: (h) => h(App),
    }).$mount('#app');
  }
}
/**
 * Cascadeo logo
 */
/* tslint:disable-next-line:no-console */
console.log(
  `%c                       _
 ___ ___ ___ ___ ___ _| |___ ___   //  Platform
|  _| .'|_ -|  _| .'| . | -_| . |  //  ${process.env.VUE_APP_ENV} - ${process.env.NODE_ENV}
|___|__,|___|___|__,|___|___|___|  //  ${process.env.VUE_APP_BUILD_TS}`,
  'color:#2892C7'
);
