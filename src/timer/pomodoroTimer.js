import { appStore } from '../store/appStore.js';
import { actions } from '../store/actions.js';
import { sendNotification } from '../utils/notification.js';

class PomodoroTimer {
  #intervalId = null;

  start(listId, todoId, seconds) {
    this.#clear();
    actions.setTimer({
      activeTodoId: todoId,
      activeListId: listId,
      remainingSeconds: seconds,
    });

    this.#intervalId = setInterval(() => {
      const { timer, lists } = appStore.getState();

      if (timer.remainingSeconds <= 1) {
        const list = lists.find((l) => l.id === listId);
        const todo = list?.todos.find((t) => t.id === todoId);
        actions.tickTimer();
        actions.incrementPomodoroCount(listId, todoId);
        this.#clear();
        actions.resetTimer();
        sendNotification(
          '뽀모도로 완료! 🍅',
          `"${todo?.text}" 세션이 끝났습니다.`,
        );
        return;
      }

      actions.tickTimer();
    }, 1000);
  }

  pause() {
    this.#clear();
    actions.pauseTimer();
  }

  resume() {
    const { timer } = appStore.getState();
    this.start(timer.activeListId, timer.activeTodoId, timer.remainingSeconds);
  }

  stop() {
    this.#clear();
    actions.resetTimer();
  }

  isRunning() {
    return this.#intervalId !== null;
  }

  #clear() {
    if (this.#intervalId !== null) {
      clearInterval(this.#intervalId);
      this.#intervalId = null;
    }
  }
}

export const pomodoroTimer = new PomodoroTimer();
