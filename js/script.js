// Seleção de elementos --------------------------------------

const todoForm = document.querySelector('#todo-form');
const todoInput = document.querySelector('#todo-input');
const todoList = document.querySelector('#todo-list');
const editForm = document.querySelector('#edit-form');
const editInput = document.querySelector('#edit-input');
const cancelEditBtn = document.querySelector('#cancel-edit-btn');
const searchInput = document.querySelector('#search-input');
const eraseBtn = document.querySelector('#erase-button');
const filterBtn = document.querySelector('#filter-select');

let oldInputValue; //variável global para armazenar texto antigo.

// Funções ----------------------------------------------------

const saveTodo = (text, done = 0, save = 1) => {
  const todo = document.createElement('div');
  todo.classList.add('todo');

  const todoTitle = document.createElement('h3');
  todoTitle.innerText = text;
  todo.appendChild(todoTitle);
  // console.log(todo);

  const doneBtn = document.createElement('button');
  doneBtn.classList.add('finish-todo');
  doneBtn.innerHTML = "<i class='fa-solid fa-check'></i>";
  todo.appendChild(doneBtn);

  const editBtn = document.createElement('button');
  editBtn.classList.add('edit-todo');
  editBtn.innerHTML = "<i class='fa-solid fa-pen'></i>";
  todo.appendChild(editBtn);

  const deleteBtn = document.createElement('button');
  deleteBtn.classList.add('remove-todo');
  deleteBtn.innerHTML = "<i class='fa-solid fa-xmark'></i>";
  todo.appendChild(deleteBtn);

  //Utilizando dados da localStorage
  if (done) {
    todo.classList.add('done');
  }
  if (save) {
    saveTodoLocalStorage({ text, done });
  }

  todoList.appendChild(todo);

  todoInput.value = ''; //limpar campo de input
  todoInput.focus(); //acionar automaticamente o campo de input
};

const toggleForms = () => {
  editForm.classList.toggle('hide');
  todoForm.classList.toggle('hide');
  todoList.classList.toggle('hide');
};

const updateTodo = (text) => {
  const todos = document.querySelectorAll('.todo');

  todos.forEach((todo) => {
    let todoTitle = todo.querySelector('h3');

    if (todoTitle.innerText === oldInputValue) {
      todoTitle.innerText = text;
      updateTodoLocalStorage(oldInputValue, text);
    }
  });
};

const getSearchedTodos = (search) => {
  const todos = document.querySelectorAll('.todo');

  todos.forEach((todo) => {
    const todoTitle = todo.querySelector('h3').innerText.toLowerCase();

    todo.style.display = 'flex';

    console.log(todoTitle);

    if (!todoTitle.includes(search)) {
      todo.style.display = 'none';
    }
  });
};

const filterTodos = (filterValue) => {
  const todos = document.querySelectorAll('.todo');
  switch (filterValue) {
    case 'all':
      todos.forEach((todo) => (todo.style.display = 'flex')); // esse select é para apresentar todas as tarefas

      break;

    case 'done': // verifica o select como tarefas feitas
      todos.forEach((todo) =>
        todo.classList.contains('done')
          ? (todo.style.display = 'flex')
          : (todo.style.display = 'none')
      );

      break;

    case 'todo': // verifica o select como tarefas pendentes
      todos.forEach((todo) =>
        !todo.classList.contains('done')
          ? (todo.style.display = 'flex')
          : (todo.style.display = 'none')
      );

      break;

    default:
      break;
  }
};

// Eventos -------------------------------------------------------

todoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  // console.log('Enviou Form');

  const inputValue = todoInput.value;
  if (inputValue) {
    // console.log(inputValue);
    saveTodo(inputValue);
  }
});

document.addEventListener('click', (e) => {
  const targetElement = e.target;
  const parentElemnt = targetElement.closest('div');
  let todoTitle; //utilizando a variável no escopo Global ao invés no escopo do bloco

  if (parentElemnt && parentElemnt.querySelector('h3')) {
    todoTitle = parentElemnt.querySelector('h3').innerText;
  }

  if (targetElement.classList.contains('finish-todo')) {
    // console.log('clicou para finalizar');
    parentElemnt.classList.toggle('done'); // adiciona a classe done e o toggle serve para desmarcar, retirar a classe
    updateTodosStatusLocalStorage(todoTitle);
  }
  if (targetElement.classList.contains('remove-todo')) {
    parentElemnt.remove();

    removeTodoLocalStorage(todoTitle);
  }

  if (targetElement.classList.contains('edit-todo')) {
    toggleForms();

    editInput.value = todoTitle; // deixa a info da tarefa pré-preenchida
    oldInputValue = todoTitle; //salvando o valor anterior do input na memória como se fosse bd para depois consultar.
  }
});

cancelEditBtn.addEventListener('click', (e) => {
  e.preventDefault();

  toggleForms();
});

editForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const editInputValue = editInput.value;

  if (editInputValue) {
    updateTodo(editInputValue);
  }

  toggleForms();
});

searchInput.addEventListener('keyup', (e) => {
  const search = e.target.value;

  getSearchedTodos(search);
});

eraseBtn.addEventListener('click', (e) => {
  e.preventDefault();

  searchInput.value = ''; //apaga o campo mas não volta a aparecer as tarefas
  searchInput.dispatchEvent(new Event('keyup')); //simular um keyup para as tarefas voltarem a aparecer
});

filterBtn.addEventListener('change', (e) => {
  const filterValue = e.target.value;

  // console.log(filterValue);
  filterTodos(filterValue);
});

// Local Storage -------------------------------------------------------

const getTodoLocalStorage = () => {
  const todos = JSON.parse(localStorage.getItem('todos')) || []; // função para pegar os dados da localstorage, mas os dados por vir em texto precisa converter para tipo JSON para conseguir salvar no local storage. Se não tiver nada lá, me envia um array vazio

  return todos;
};

const loadTodos = () => {
  //função para imprimir na tela as tarefas do localstorage
  const todos = getTodoLocalStorage();
  todos.forEach((todo) => {
    saveTodo(todo.text, todo.done, 0);
  });
};

const saveTodoLocalStorage = (todo) => {
  const todos = getTodoLocalStorage(); // pegar todos os todos da Local Storage

  todos.push(todo); //adicionar o novo todo no array

  localStorage.setItem('todos', JSON.stringify(todos)); //salvar tudo na local storage, criamos a chave todos. Agora precisa conectar isso com o nosso código existente.
};

const removeTodoLocalStorage = (todoText) => {
  const todos = getTodoLocalStorage(); // função para remover os itens do localstorage

  const filteredTodos = todos.filter((todo) => todo.text !== todoText);
  localStorage.setItem('todos', JSON.stringify(filteredTodos));
};

const updateTodosStatusLocalStorage = (todoText) => {
  const todos = getTodoLocalStorage();
  todos.map((todo) =>
    todo.text === todoText ? (todo.done = !todo.done) : null
  );
  localStorage.setItem('todos', JSON.stringify(todos));
};

const updateTodoLocalStorage = (todoOldText, todoNewText) => {
  const todos = getTodoLocalStorage();
  todos.map((todo) =>
    todo.text === todoOldText ? (todo.text = todoNewText) : null
  );
  localStorage.setItem('todos', JSON.stringify(todos));
};

loadTodos();
