/**
 * Vee Validate Config
 */

import Vue from 'vue';
import VeeValidate from 'vee-validate';

/* Import validation dictionary */
import dict from './dict';

/* Config Options */
const veeConfig = {
  delay: 350,
  strict: true,
  classes: true,
  locale: 'en',
  classNames: {
    touched: 'touched',
    untouched: 'untouched',
    valid: 'valid',
    invalid: 'invalid',
    pristine: 'pristine',
    dirty: 'dirty',
  },
  aria: true,
};

/* Attach to Vue */
Vue.use(VeeValidate, veeConfig);

/* Loads localization dictionary */
VeeValidate.Validator.localize(dict.dict);

/**
 * Custom, Global Validations
 */

/**
 * Checks to see if a string has leading or trailing hypens (-)
 * Fails if it does. Ex: `-nimbus-` = FAIL check
 */
VeeValidate.Validator.extend('hyphen', {
  getMessage(value: any, field: any) {
    return `${value} cannot start or end with hyphens.`;
  },
  validate(value: any, field: any) {
    const regex = new RegExp('^\-+|\-+$', 'g');
    return !regex.test(value);
  },
});
