import { Store } from './store.js';

const STORAGE_KEY = 'pomodoro-todo';

const defaultState = {
  lists: [],
  selectedListId: null,
  timer: {
    activeTodoId: null,
    activeListId: null,
    isPaused: false,
    remainingSeconds: 0,
  },
};

const loadState = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return defaultState;
    const parsed = JSON.parse(saved);
    return { ...defaultState, ...parsed, timer: defaultState.timer };
  } catch {
    return defaultState;
  }
};

export const appStore = new Store(loadState());

appStore.subscribe(() => {
  const { lists, selectedListId } = appStore.getState();
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ lists, selectedListId }));
});
