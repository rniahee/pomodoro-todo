import { appStore } from '../../store/appStore.js';
import { actions } from '../../store/actions.js';
import { pomodoroTimer } from '../../timer/pomodoroTimer.js';
import { escapeHtml } from '../../utils/escapeHtml.js';
import { formatTime } from '../../utils/formatTime.js';

export const mountTodoItem = (container, listId, todo) => {
  const { timer } = appStore.getState();
  const isRunning = pomodoroTimer.isRunning();
  const isActive = timer.activeTodoId === todo.id;
  const isPaused = isActive && timer.isPaused;

  const remainingDisplay = isActive
    ? formatTime(timer.remainingSeconds)
    : formatTime(todo.pomodoroMinutes * 60);

  container.innerHTML = `
    <div class="todo-item ${todo.isDone ? 'todo-item--done' : ''} ${isActive ? 'todo-item--active' : ''}">
      <input class="todo-item__check" type="checkbox" ${todo.isDone ? 'checked' : ''} />
      <span class="todo-item__text">${escapeHtml(todo.text)}</span>
      <span class="todo-item__count">${todo.pomodoroCount}🍅</span>
      <span class="todo-item__time">${remainingDisplay}</span>
      <button class="todo-item__start" ${todo.isDone || (isRunning && !isActive) ? 'disabled' : ''}>
        ${isActive ? (isPaused ? '재개' : '일시정지') : '시작'}
      </button>
      <button class="todo-item__delete" ${isActive ? 'disabled' : ''}>✕</button>
    </div>
  `;

  container
    .querySelector('.todo-item__check')
    .addEventListener('change', () => {
      actions.toggleTodo(listId, todo.id);
    });

  container.querySelector('.todo-item__start').addEventListener('click', () => {
    if (isActive) {
      if (isPaused) {
        pomodoroTimer.resume();
      } else {
        pomodoroTimer.pause();
      }
    } else {
      pomodoroTimer.start(listId, todo.id, todo.pomodoroMinutes * 60);
    }
  });

  container
    .querySelector('.todo-item__delete')
    .addEventListener('click', () => {
      actions.deleteTodo(listId, todo.id);
    });
};
