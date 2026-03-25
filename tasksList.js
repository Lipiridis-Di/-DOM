const tasks = [
  { id: 1, completed: false, text: 'Посмотреть новый урок по JavaScript' },
  { id: 2, completed: false, text: 'Выполнить тест после урока' },
  { id: 3, completed: false, text: 'Сделать домашнее задание' },
  { id: 4, completed: false, text: 'Пройти интенсив на соточку' },
  { id: 5, completed: false, text: 'Купить продукты' },
];

const tasksList = document.querySelector('.tasks-list');
const createTaskForm = document.querySelector('.create-task-block');
let isDarkTheme = false;
let taskIdToDelete = null;

// --------------------
// Тема
// --------------------

function applyTheme() {
  document.body.style.background = isDarkTheme ? '#24292E' : 'initial';

  const taskItems = document.querySelectorAll('.task-item');
  taskItems.forEach((taskItem) => {
    taskItem.style.color = isDarkTheme ? '#ffffff' : 'initial';
  });

  const buttons = document.querySelectorAll('button');
  buttons.forEach((button) => {
    button.style.border = isDarkTheme ? '1px solid #ffffff' : 'none';
  });
}

function toggleTheme() {
  isDarkTheme = !isDarkTheme;
  applyTheme();
}

// --------------------
// Работа с ошибками
// --------------------

function getErrorMessageBlock() {
  return createTaskForm.querySelector('.error-message-block');
}

function showErrorMessage(message) {
  let errorMessageBlock = getErrorMessageBlock();

  if (!errorMessageBlock) {
    errorMessageBlock = document.createElement('span');
    errorMessageBlock.className = 'error-message-block';
    createTaskForm.append(errorMessageBlock);
  }

  errorMessageBlock.textContent = message;
}

function removeErrorMessage() {
  const errorMessageBlock = getErrorMessageBlock();

  if (errorMessageBlock) {
    errorMessageBlock.remove();
  }
}

// --------------------
// Работа с задачами
// --------------------

function getTaskItemById(taskId) {
  return tasksList.querySelector(`[data-task-id="${taskId}"]`);
}

function getNextTaskId() {
  return Math.max(...tasks.map((task) => task.id)) + 1;
}

function hasTaskWithText(taskText) {
  return tasks.some((task) => task.text === taskText);
}

function createTaskElement(task) {
  const taskItem = document.createElement('div');
  taskItem.className = 'task-item';
  taskItem.setAttribute('data-task-id', task.id);

  const taskMainContainer = document.createElement('div');
  taskMainContainer.className = 'task-item__main-container';

  const taskMainContent = document.createElement('div');
  taskMainContent.className = 'task-item__main-content';

  const checkboxForm = document.createElement('form');
  checkboxForm.className = 'checkbox-form';

  const checkbox = document.createElement('input');
  checkbox.className = 'checkbox-form__checkbox';
  checkbox.type = 'checkbox';
  checkbox.id = `task-${task.id}`;

  const label = document.createElement('label');
  label.setAttribute('for', `task-${task.id}`);

  const textSpan = document.createElement('span');
  textSpan.className = 'task-item__text';
  textSpan.textContent = task.text;

  const deleteButton = document.createElement('button');
  deleteButton.className = 'task-item__delete-button default-button delete-button';
  deleteButton.textContent = 'Удалить';

  checkboxForm.append(checkbox, label);
  taskMainContent.append(checkboxForm, textSpan);
  taskMainContainer.append(taskMainContent, deleteButton);
  taskItem.append(taskMainContainer);

  return taskItem;
}

function renderTask(task) {
  const taskElement = createTaskElement(task);
  tasksList.append(taskElement);
  applyTheme();
}

function addTask(taskText) {
  const newTask = {
    id: getNextTaskId(),
    completed: false,
    text: taskText,
  };

  tasks.push(newTask);
  renderTask(newTask);
}

function deleteTask(taskId) {
  const taskIndex = tasks.findIndex((task) => task.id === taskId);

  if (taskIndex === -1) {
    return;
  }

  tasks.splice(taskIndex, 1);

  const taskItem = getTaskItemById(taskId);

  if (taskItem) {
    taskItem.remove();
  }
}

// --------------------
// Модальное окно удаления
// --------------------

function closeDeleteModal() {
  const modalOverlay = document.querySelector('.modal-overlay');

  if (modalOverlay) {
    modalOverlay.remove();
  }

  taskIdToDelete = null;
}

function createDeleteModal() {
  const modalOverlay = document.createElement('div');
  modalOverlay.className = 'modal-overlay';

  const deleteModal = document.createElement('div');
  deleteModal.className = 'delete-modal';

  const modalQuestion = document.createElement('h3');
  modalQuestion.className = 'delete-modal__question';
  modalQuestion.textContent = 'Вы действительно хотите удалить эту задачу?';

  const modalButtons = document.createElement('div');
  modalButtons.className = 'delete-modal__buttons';

  const cancelButton = document.createElement('button');
  cancelButton.type = 'button';
  cancelButton.className = 'delete-modal__button delete-modal__cancel-button';
  cancelButton.textContent = 'Отмена';

  const confirmButton = document.createElement('button');
  confirmButton.type = 'button';
  confirmButton.className = 'delete-modal__button delete-modal__confirm-button';
  confirmButton.textContent = 'Удалить';

  cancelButton.addEventListener('click', closeDeleteModal);
  confirmButton.addEventListener('click', () => {
    deleteTask(taskIdToDelete);
    closeDeleteModal();
  });

  modalButtons.append(cancelButton, confirmButton);
  deleteModal.append(modalQuestion, modalButtons);
  modalOverlay.append(deleteModal);

  return modalOverlay;
}

function openDeleteModal(taskId) {
  closeDeleteModal();
  taskIdToDelete = taskId;
  document.body.append(createDeleteModal());
  applyTheme();
}

tasks.forEach((task) => {
  renderTask(task);
});

applyTheme();

// --------------------
// Обработчики событий
// --------------------

createTaskForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const taskInput = event.target.querySelector('.create-task-block__input');
  const taskText = taskInput.value.trim();

  if (!taskText) {
    showErrorMessage('Название задачи не должно быть пустым');
    return;
  }

  if (hasTaskWithText(taskText)) {
    showErrorMessage('Задача с таким названием уже существует.');
    return;
  }

  removeErrorMessage();
  addTask(taskText);
  taskInput.value = '';
});

tasksList.addEventListener('click', (event) => {
  const deleteButton = event.target.closest('.task-item__delete-button');

  if (!deleteButton) {
    return;
  }

  const taskItem = deleteButton.closest('.task-item');

  if (!taskItem) {
    return;
  }

  openDeleteModal(Number(taskItem.dataset.taskId));
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Tab') {
    return;
  }

  event.preventDefault();
  toggleTheme();
});
