import { appStore } from '../../store/appStore.js';
import { actions } from '../../store/actions.js';
import { mountTodoInput } from './todoInput.js';
import { mountTodoItem } from './todoItem.js';
import './todoPanel.css';

const setupDragAndDrop = (listEl, listId) => {
  let draggedIndex = null;

  listEl.querySelectorAll('li').forEach((li, index) => {
    li.setAttribute('draggable', 'true');

    li.addEventListener('dragstart', () => {
      draggedIndex = index;
      li.classList.add('todo-item--dragging');
    });

    li.addEventListener('dragend', () => {
      li.classList.remove('todo-item--dragging');
      listEl.querySelectorAll('li').forEach((el) => {
        el.classList.remove('todo-item--drag-over');
      });
    });

    li.addEventListener('dragover', (e) => {
      e.preventDefault();
      if (index === draggedIndex) return;
      listEl.querySelectorAll('li').forEach((el) => {
        el.classList.remove('todo-item--drag-over');
      });
      li.classList.add('todo-item--drag-over');
    });

    li.addEventListener('dragleave', () => {
      li.classList.remove('todo-item--drag-over');
    });

    li.addEventListener('drop', (e) => {
      e.preventDefault();
      li.classList.remove('todo-item--drag-over');
      if (draggedIndex === null || draggedIndex === index) return;
      actions.reorderTodos(listId, draggedIndex, index);
    });
  });
};

export const mountTodoPanel = (container) => {
  const render = () => {
    const { lists, selectedListId } = appStore.getState();
    const selectedList = lists.find((l) => l.id === selectedListId);

    if (!selectedList) {
      container.innerHTML = `
        <div class="todo-panel todo-panel--empty">
          <p>목록을 선택해주세요</p>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="todo-panel">
        <h2 class="todo-panel__title">${selectedList.name}</h2>
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
