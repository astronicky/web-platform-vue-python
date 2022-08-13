import Vue from 'vue';
import axios, { AxiosRequestConfig, AxiosResponse, AxiosStatic } from 'axios';

import Auth from '@/common/auth';
import Iam from '@/common/iam';

import API from '@/API';

/* Aliasing axios as api */
const http: AxiosStatic = axios;
http.defaults.baseURL = process.env.VUE_APP_API_BASE_V1;

/* Do something before request is sent */
http.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    return new Promise((resolve, reject) => {
      Iam.validSession()
        .then((token: string) => {
          /* Check is `async` param is set, and strip. */
          /* If set, then don't show spinner */
          if ('params' in config && 'async' in config.params) {
            delete config.params.async;
          } else {
            API.UI.showSpin();
          }
          config.headers.common.Authorization = `Bearer ${token}`;
          resolve(config);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  (error) => {
    /* Do something with request error */
    API.UI.hideSpin();
    return Promise.reject(error);
  }
);

/* Do something before response returns data */
http.interceptors.response.use(
  (response: AxiosResponse) => {
    API.UI.hideSpin();
    return response;
  },
  (error) => {
    console.log(error);
    /* Do something with response error */
    API.UI.hideSpin();
    if (error.response.status === 401) {
      Auth.logout();
    }
    return Promise.reject(error);
  }
);

export default http;
