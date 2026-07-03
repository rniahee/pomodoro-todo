import { appStore } from '../../store/appStore.js';
import { mountListInput } from './listInput.js';
import { mountListItem } from './listItem.js';
import './listPanel.css';

export const mountListPanel = (container) => {
  const render = () => {
    const { lists } = appStore.getState();

    container.innerHTML = `
      <div class="list-panel">
        <div class="list-panel__input-area"></div>
        <ul class="list-panel__list">
          ${lists.map((list) => `<li data-id="${list.id}"></li>`).join('')}
        </ul>
      </div>
    `;

    mountListInput(container.querySelector('.list-panel__input-area'));

    lists.forEach((list) => {
      const li = container.querySelector(`li[data-id="${list.id}"]`);
      mountListItem(li, list);
    });
  };

  appStore.subscribe(render);
  render();
};
