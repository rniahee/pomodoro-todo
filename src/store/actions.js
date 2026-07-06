import { appStore } from './appStore.js';

const generateId = () => Date.now().toString();

function updateTodosInList(prev, listId, updater) {
  return {
    ...prev,
    lists: prev.lists.map((l) =>
      l.id !== listId ? l : { ...l, todos: updater(l.todos) },
    ),
  };
}

export const actions = {
  // 목록
  addList(name) {
    appStore.setState((prev) => ({
      ...prev,
      lists: [...prev.lists, { id: generateId(), name, todos: [] }],
    }));
  },

  deleteList(listId) {
    appStore.setState((prev) => ({
      ...prev,
      lists: prev.lists.filter((l) => l.id !== listId),
      selectedListId:
        prev.selectedListId === listId ? null : prev.selectedListId,
    }));
  },

  selectList(listId) {
    appStore.setState((prev) => ({ ...prev, selectedListId: listId }));
  },

  // 할 일
  addTodo(listId, text, pomodoroMinutes) {
    appStore.setState((prev) =>
      updateTodosInList(prev, listId, (todos) => [
        ...todos,
        {
          id: generateId(),
          text,
          pomodoroMinutes,
          pomodoroCount: 0,
          isDone: false,
        },
      ]),
    );
  },

  updateTodo(listId, todoId, text, pomodoroMinutes) {
    appStore.setState((prev) =>
      updateTodosInList(prev, listId, (todos) =>
        todos.map((t) =>
          t.id !== todoId ? t : { ...t, text, pomodoroMinutes },
        ),
      ),
    );
  },

  deleteTodo(listId, todoId) {
    appStore.setState((prev) =>
      updateTodosInList(prev, listId, (todos) =>
        todos.filter((t) => t.id !== todoId),
      ),
    );
  },

  toggleTodo(listId, todoId) {
    appStore.setState((prev) =>
      updateTodosInList(prev, listId, (todos) =>
        todos.map((t) => (t.id !== todoId ? t : { ...t, isDone: !t.isDone })),
      ),
    );
  },

  // 타이머
  setTimer({ activeTodoId, activeListId, remainingSeconds }) {
    appStore.setState((prev) => ({
      ...prev,
      timer: {
        ...prev.timer,
        activeTodoId,
        activeListId,
        remainingSeconds,
        isPaused: false,
      },
    }));
  },

  tickTimer() {
    appStore.setState((prev) => ({
      ...prev,
      timer: {
        ...prev.timer,
        remainingSeconds: prev.timer.remainingSeconds - 1,
      },
    }));
  },

  pauseTimer() {
    appStore.setState((prev) => ({
      ...prev,
      timer: { ...prev.timer, isPaused: true },
    }));
  },

  resetTimer() {
    appStore.setState((prev) => ({
      ...prev,
      timer: {
        activeTodoId: null,
        activeListId: null,
        isPaused: false,
        remainingSeconds: 0,
      },
    }));
  },

  incrementPomodoroCount(listId, todoId) {
    appStore.setState((prev) =>
      updateTodosInList(prev, listId, (todos) =>
        todos.map((t) =>
          t.id !== todoId ? t : { ...t, pomodoroCount: t.pomodoroCount + 1 },
        ),
      ),
    );
  },
};
