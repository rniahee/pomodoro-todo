import { Store } from './store.js';

const initialState = {
  lists: [],
  selectedListId: null,
  timer: {
    activeTodoId: null,
    activeListId: null,
    isPaused: false,
    remainingSeconds: 0,
  },
};

export const appStore = new Store(initialState);
