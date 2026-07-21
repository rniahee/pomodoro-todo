import { appStore } from '../../store/appStore.js';
import { actions } from '../../store/actions.js';
import { pomodoroTimer } from '../../timer/pomodoroTimer.js';
import { formatTime } from '../../utils/formatTime.js';
import { mountTodoInput } from './todoInput.js';
import { mountTodoItem } from './todoItem.js';
import './todoPanel.css';

const calcStats = (todos) => {
  const total = todos.length;
  const done = todos.filter((t) => t.isDone).length;
  const rate = total === 0 ? 0 : Math.round((done / total) * 100);
  const pomodoros = todos.reduce((sum, t) => sum + t.pomodoroCount, 0);
  return { total, done, rate, pomodoros };
};

const renderStats = (current, all) => `
  <div class="stats">
    <div class="stats__row">
      <span class="stats__label">현재 목록</span>
      <span class="stats__item">전체 <b>${current.total}</b></span>
      <span class="stats__item">완료 <b>${current.done}</b></span>
      <span class="stats__item">완료율 <b>${current.rate}%</b></span>
      <span class="stats__item">🍅 <b>${current.pomodoros}</b></span>
    </div>
    <div class="stats__row">
      <span class="stats__label">전체 목록</span>
      <span class="stats__item">전체 <b>${all.total}</b></span>
      <span class="stats__item">완료 <b>${all.done}</b></span>
      <span class="stats__item">완료율 <b>${all.rate}%</b></span>
      <span class="stats__item">🍅 <b>${all.pomodoros}</b></span>
    </div>
  </div>
`;

const setupDragAndDrop = (listEl, listId) => {
  let draggedIndex = null;
  let dragOverEl = null;

  const clearDragOver = () => {
    if (dragOverEl) {
      dragOverEl.classList.remove('todo-item--drag-over');
      dragOverEl = null;
    }
  };

  listEl.querySelectorAll('li').forEach((li, index) => {
    li.setAttribute('draggable', 'true');

    li.addEventListener('dragstart', () => {
      draggedIndex = index;
      li.classList.add('todo-item--dragging');
    });

    li.addEventListener('dragend', () => {
      li.classList.remove('todo-item--dragging');
      clearDragOver();
    });

    li.addEventListener('dragover', (e) => {
      e.preventDefault();
      if (index === draggedIndex) return;
      if (dragOverEl !== li) {
        clearDragOver();
        dragOverEl = li;
        li.classList.add('todo-item--drag-over');
      }
    });

    li.addEventListener('dragleave', () => {
      clearDragOver();
    });

    li.addEventListener('drop', (e) => {
      e.preventDefault();
      clearDragOver();
      if (draggedIndex === null || draggedIndex === index) return;
      actions.reorderTodos(listId, draggedIndex, index);
    });
  });
};

const updateTimerDisplay = (container, todos, timer) => {
  const isRunning = pomodoroTimer.isRunning();

  todos.forEach((todo) => {
    const li = container.querySelector(`li[data-id="${todo.id}"]`);
    if (!li) return;

    const isActive = timer.activeTodoId === todo.id;
    const isPaused = isActive && timer.isPaused;

    const timeEl = li.querySelector('.todo-item__time');
    if (timeEl) {
      timeEl.textContent = isActive
        ? formatTime(timer.remainingSeconds)
        : formatTime(todo.pomodoroMinutes * 60);
    }

    const itemEl = li.querySelector('.todo-item');
    if (itemEl) {
      itemEl.classList.toggle('todo-item--active', isActive);
    }

    const startBtn = li.querySelector('.todo-item__start');
    if (startBtn) {
      startBtn.textContent = isActive
        ? isPaused
          ? '재개'
          : '일시정지'
        : '시작';
      startBtn.disabled = todo.isDone || (isRunning && !isActive);
    }
  });
};

export const mountTodoPanel = (container) => {
  let prevLists = null;
  let prevSelectedListId = null;

  const render = () => {
    const { lists, selectedListId, timer } = appStore.getState();
    const selectedList = lists.find((l) => l.id === selectedListId);

    if (lists === prevLists && selectedListId === prevSelectedListId) {
      if (selectedList) {
        updateTimerDisplay(container, selectedList.todos, timer);
      }
      return;
    }

    prevLists = lists;
    prevSelectedListId = selectedListId;

    if (!selectedList) {
      container.innerHTML = `
        <div class="todo-panel todo-panel--empty">
          <p>목록을 선택해주세요</p>
        </div>
      `;
      return;
    }

    const allTodos = lists.flatMap((l) => l.todos);
    const currentStats = calcStats(selectedList.todos);
    const allStats = calcStats(allTodos);

    container.innerHTML = `
      <div class="todo-panel">
        <h2 class="todo-panel__title">${selectedList.name}</h2>
        ${renderStats(currentStats, allStats)}
        <div class="todo-panel__input-area"></div>
        <ul class="todo-panel__list">
          ${selectedList.todos.map((todo) => `<li data-id="${todo.id}"></li>`).join('')}
        </ul>
      </div>
    `;

    mountTodoInput(
      container.querySelector('.todo-panel__input-area'),
      selectedListId,
    );

    selectedList.todos.forEach((todo) => {
      const li = container.querySelector(`li[data-id="${todo.id}"]`);
      mountTodoItem(li, selectedListId, todo);
    });

    setupDragAndDrop(
      container.querySelector('.todo-panel__list'),
      selectedListId,
    );
  };

  appStore.subscribe(render);
  render();
};
