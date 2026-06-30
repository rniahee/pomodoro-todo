import { mountHeader } from './components/header/header.js';
import { mountListPanel } from './components/listPanel/listPanel.js';
import { mountTodoPanel } from './components/todoPanel/todoPanel.js';

const app = document.querySelector('#app');

app.innerHTML = `
  <header id="header"></header>
  <main id="main">
    <section id="list-panel"></section>
    <section id="todo-panel"></section>
  </main>
`;

mountHeader(document.querySelector('#header'));
mountListPanel(document.querySelector('#list-panel'));
mountTodoPanel(document.querySelector('#todo-panel'));
