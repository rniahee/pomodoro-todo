import { appStore } from '../store/appStore.js';
import { actions } from '../store/actions.js';

class PomodoroTimer {
  #intervalId = null;

  start(listId, todoId, seconds) {
    this.stop();
    actions.setTimer({
      activeTodoId: todoId,
      activeListId: listId,
      remainingSeconds: seconds,
    });

    this.#intervalId = setInterval(() => {
      const { timer } = appStore.getState();

      if (timer.isPaused) return;

      if (timer.remainingSeconds <= 1) {
        actions.tickTimer();
        actions.incrementPomodoroCount(listId, todoId);
        this.stop();
        return;
      }

      actions.tickTimer();
    }, 1000);
  }

  pause() {
    actions.pauseTimer();
  }

  resume() {
    actions.resumeTimer();
  }

  stop() {
    if (this.#intervalId !== null) {
      clearInterval(this.#intervalId);
      this.#intervalId = null;
    }
    actions.resetTimer();
  }

  isRunning() {
    return this.#intervalId !== null;
  }
}

export const pomodoroTimer = new PomodoroTimer();
