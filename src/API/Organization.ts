import http from '@/common/http';
import Auth from '@/common/auth';
import store from '@/store/store';
import router from '@/router/router';

import * as STORE_ORGANIZATION from '@/store/modules/STORE_ORGANIZATION';

import API from '@/API';

const Organizations = {
  /**
   * Gets from the local store, to be reactive to changes in Sidebar
   */
  getAll(): Org[] {
    try {
      return STORE_ORGANIZATION.getAll(store);
    } catch (error) {
      throw error;
    }
  },
  getCurrentId(): string {
    try {
      return STORE_ORGANIZATION.getCurrentId(store);
    } catch (error) {
      throw error;
    }
  },
  setAll(orgList: Org[]): void {
    orgList.sort((a: Org, b: Org) => {
      return a.order_by - b.order_by;
    });
    this.update(orgList);
    STORE_ORGANIZATION.setAll(store, orgList);
  },
  update(orgList: Org[]): void {
    http.put(`organizations`, orgList);
  },
  add(organizationId: string): void {
    http
      .post(`organizations`, {
        organization_id: organizationId,
        order_by: 0,
      })
      .then(() => {
        API.UI.addNotification({
          type: 'primary',
          text: `Organization "${organizationId}" added successfully.`,
        });
        this.sync();
        router.replace('/');
      })
      .catch((error: any) => {
        if (error.response.status === 400) {
          API.UI.addNotification({
            type: 'danger',
            text: 'Organization name already exists, choose another name.',
          });
        } else {
          API.UI.addNotification({
            type: 'danger',
            text: 'Organization could not be added.',
          });
        }
        throw new Error('Organization could not be added.');
      });
  },
  /**
   * Fetches Organziation from database and adds them to local
   * client store, "syncing" front and back end.
   */
  async sync(): Promise<void> {
    try {
      await http.get(`organizations`).then((res: any) => {
        this.setAll(res.data);
        Auth.validSession(true);
      });
    } catch (error) {
      throw new Error('Cannot sync organizations list.');
    }
  },
};

export default Organizations;
