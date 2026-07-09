import { appStore } from '../../store/appStore.js';
import { pomodoroTimer } from '../../timer/pomodoroTimer.js';
import { formatTime } from '../../utils/formatTime.js';
import './header.css';

const THEME_KEY = 'pomodoro-theme';

const getTheme = () => localStorage.getItem(THEME_KEY) ?? 'light';

const applyTheme = (theme) => {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem(THEME_KEY, theme);
};

applyTheme(getTheme());

export const mountHeader = (container) => {
  const render = () => {
    const { lists, timer } = appStore.getState();
    const { activeTodoId, activeListId, remainingSeconds, isPaused } = timer;

    const activeList = lists.find((l) => l.id === activeListId);
    const activeTodo = activeList?.todos.find((t) => t.id === activeTodoId);
    const isRunning = pomodoroTimer.isRunning();
    const isDark = getTheme() === 'dark';

    container.innerHTML = `
      <div class="header">
        <span class="header__title">Pomodoro Todo</span>
        <div class="header__timer">
          ${
            isRunning
              ? `
            <span class="header__todo-name">${activeTodo?.text ?? ''}</span>
            <span class="header__time">${formatTime(remainingSeconds)}</span>
            <button class="header__btn js-pause-resume">
              ${isPaused ? '재개' : '일시정지'}
            </button>
            <button class="header__btn js-stop">중지</button>
          `
              : ''
          }
        </div>
        <button class="header__theme-btn js-theme">${isDark ? '☀️' : '🌙'}</button>
      </div>
    `;

    container
      .querySelector('.js-pause-resume')
      ?.addEventListener('click', () => {
        if (isPaused) {
          pomodoroTimer.resume();
        } else {
          pomodoroTimer.pause();
        }
      });

    container.querySelector('.js-stop')?.addEventListener('click', () => {
      pomodoroTimer.stop();
    });

    container.querySelector('.js-theme').addEventListener('click', () => {
      applyTheme(getTheme() === 'dark' ? 'light' : 'dark');
      render();
    });
  };

  appStore.subscribe(render);
  render();
};
