import { actions } from '../../store/actions.js';

export const mountTodoInput = (container, listId) => {
  container.innerHTML = `
    <div class="todo-input">
      <input class="todo-input__field" type="text" placeholder="할 일 추가..." />
      <input class="todo-input__minutes" type="number" min="1" max="60" value="25" />
      <span class="todo-input__unit">분</span>
      <button class="todo-input__btn">추가</button>
    </div>
    <p class="todo-input__error"></p>
  `;

  const textInput = container.querySelector('.todo-input__field');
  const minutesInput = container.querySelector('.todo-input__minutes');
  const btn = container.querySelector('.todo-input__btn');
  const error = container.querySelector('.todo-input__error');

  const showError = (msg) => {
    error.textContent = msg;
  };
  const clearError = () => {
    error.textContent = '';
  };

  const submit = () => {
    const text = textInput.value.trim();
    const minutes = parseInt(minutesInput.value, 10);

    if (!text) {
      showError('할 일을 입력해주세요.');
      return;
    }
    if (!minutes || minutes < 1 || minutes > 60) {
      showError('뽀모도로 시간은 1~60분 사이로 입력해주세요.');
      return;
    }

    clearError();
    actions.addTodo(listId, text, minutes);
    textInput.value = '';
    minutesInput.value = '25';
  };

  btn.addEventListener('click', submit);
  textInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') submit();
  });
  textInput.addEventListener('input', clearError);
  minutesInput.addEventListener('input', clearError);
};
