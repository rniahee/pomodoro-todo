import { actions } from '../../store/actions.js';

export const mountListInput = (container) => {
  container.innerHTML = `
    <div class="list-input">
      <input class="list-input__field" type="text" placeholder="목록 추가..." />
      <button class="list-input__btn">추가</button>
    </div>
    <p class="list-input__error"></p>
  `;

  const input = container.querySelector('.list-input__field');
  const btn = container.querySelector('.list-input__btn');
  const error = container.querySelector('.list-input__error');

  const showError = (msg) => {
    error.textContent = msg;
  };
  const clearError = () => {
    error.textContent = '';
  };

  const submit = () => {
    const name = input.value.trim();
    if (!name) {
      showError('목록 이름을 입력해주세요.');
      return;
    }
    clearError();
    actions.addList(name);
    input.value = '';
  };

  btn.addEventListener('click', submit);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') submit();
  });
  input.addEventListener('input', clearError);
};
