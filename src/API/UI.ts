import Vue from 'vue';
import { format } from 'date-fns';

import store from '@/store/store';
import * as STORE_UI from '@/store/modules/STORE_UI';

const UI = {
  /**
   * Spinner
   */
  showSpin(): void {
    try {
      STORE_UI.showSpin(store);
    } catch (error) {
      throw error;
    }
  },
  hideSpin(): void {
    try {
      STORE_UI.hideSpin(store);
    } catch (error) {
      throw error;
    }
  },
  isSpin(): boolean {
    try {
      return STORE_UI.isSpin(store);
    } catch (error) {
      throw error;
    }
  },
  /**
   * Notifications
   */
  addNotification(payload: AppNotification): void {
    let dur: number = 7000; /* 7 seconds */

    /* Sync with `notifications.scss` styles */
    if (payload.type === 'danger') {
      dur = 9999999; /* ~2.77 hours */
    }
    try {
      Vue.notify({
        duration: dur,
        text: payload.text,
        type: payload.type,
      });

    } catch (error) {
      throw error;
    }
  },
  /**
   * Compact UI
   */
  isCompactUI(): boolean {
    try {
      return STORE_UI.isCompactUI(store);
    } catch (error) {
      throw error;
    }
  },
};

export default UI;
