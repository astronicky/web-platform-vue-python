import { getStoreAccessors } from 'vuex-typescript';

import { RootState } from '@/store/types';
import { UIState } from './types';

const { commit } = getStoreAccessors<UIState, RootState>('STORE_UI');

const mutations = {
  SHOW_SPIN(state: UIState): void {
    state.spinVisible = true;
  },
  HIDE_SPIN(state: UIState): void {
    state.spinVisible = false;
  },
};

export const SHOW_SPIN = commit(mutations.SHOW_SPIN);
export const HIDE_SPIN = commit(mutations.HIDE_SPIN);

export default mutations;
