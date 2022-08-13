import { getStoreAccessors } from 'vuex-typescript';
import { RootState } from '@/store/types';
import { UIState } from './types';

const { read } = getStoreAccessors<UIState, RootState>('STORE_UI');

const getters = {
  isSpin: (state: UIState): boolean => state.spinVisible,
  // isModal: (state: UIState): boolean => state.modalVisible,
  isCompactUI: (state: UIState): boolean => state.compactUI,
};

export const isSpin = read(getters.isSpin);
export const isCompactUI = read(getters.isCompactUI);

export default getters;
