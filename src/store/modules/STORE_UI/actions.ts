import { ActionContext } from 'vuex';
import { getStoreAccessors } from 'vuex-typescript';

import { RootState } from '@/store/types';
import { UIState } from './types';

import * as STORE_UI from './mutations';

const { dispatch } = getStoreAccessors<UIState, RootState>('STORE_UI');
type UIContext = ActionContext<UIState, RootState>;

const actions = {
  showSpin(context: UIContext): void {
    STORE_UI.SHOW_SPIN(context);
  },
  hideSpin(context: UIContext): void {
    STORE_UI.HIDE_SPIN(context);
  },
};

export const showSpin = dispatch(actions.showSpin);
export const hideSpin = dispatch(actions.hideSpin);

export default actions;
