import { appStore } from '../../store/appStore.js';
import { mountTodoInput } from './todoInput.js';
import { mountTodoItem } from './todoItem.js';
import './todoPanel.css';

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
  };

  appStore.subscribe(render);
  render();
};
