import { appStore } from '../../store/appStore.js';
import { actions } from '../../store/actions.js';

export const mountListItem = (container, list) => {
  const { selectedListId } = appStore.getState();
  const isSelected = list.id === selectedListId;

  container.innerHTML = `
    <div class="list-item ${isSelected ? 'list-item--selected' : ''}">
      <span class="list-item__name">${list.name}</span>
      <button class="list-item__delete">✕</button>
    </div>
  `;

  container.querySelector('.list-item').addEventListener('click', () => {
    actions.selectList(list.id);
  });

  container
    .querySelector('.list-item__delete')
    .addEventListener('click', (e) => {
      e.stopPropagation();
      actions.deleteList(list.id);
    });
};
