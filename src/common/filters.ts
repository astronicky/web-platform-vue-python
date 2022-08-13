import Vue from 'vue';
import moment from 'moment';
import _ from 'lodash';

Vue.filter('date', (value: string) => {
  return value !== null ? moment(value).format('MM/DD/YYYY') : '';
});

Vue.filter('dateTime', (value: string) => {
  return value !== null ? moment(value).format('MM/DD/YYYY, h:mm:ss a') : '';
});

Vue.filter('capitalize', (value: string) => {
  return _.capitalize(value);
});
