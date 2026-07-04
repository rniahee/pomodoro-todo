import { appStore } from '../../store/appStore.js';
import { actions } from '../../store/actions.js';

export const mountTodoInput = (container, listId) => {
  container.innerHTML = `
    <div class="todo-input">
      <input class="todo-input__field" type="text" placeholder="할 일 추가..." />
      <input class="todo-input__minutes" type="number" min="1" max="60" value="25" />
      <span class="todo-input__unit">분</span>
      <button class="todo-input__btn">추가</button>
    </div>
  `;

  const textInput = container.querySelector('.todo-input__field');
  const minutesInput = container.querySelector('.todo-input__minutes');
  const btn = container.querySelector('.todo-input__btn');

  const submit = () => {
    const text = textInput.value.trim();
    const minutes = parseInt(minutesInput.value, 10);
    if (!text || !minutes) return;
    actions.addTodo(listId, text, minutes);
    textInput.value = '';
    minutesInput.value = '25';
  };

  btn.addEventListener('click', submit);
  textInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') submit();
  });
};
