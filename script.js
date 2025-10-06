// script.js
// Simple To-Do logic: add, delete, complete, clear all, and persistence using localStorage.

(() => {
  // Elements
  const addTaskBtn = document.getElementById('addTaskBtn');
  const taskInput = document.getElementById('taskInput');
  const taskList = document.getElementById('taskList');
  const clearAllBtn = document.getElementById('clearAllBtn');

  const STORAGE_KEY = 'simple_todo_tasks_v1';

  // Load tasks from localStorage
  function loadTasks() {
    const raw = localStorage.getItem(STORAGE_KEY);
    try {
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error('Failed to parse tasks from storage', e);
      return [];
    }
  }

  // Save tasks to localStorage
  function saveTasks(tasks) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }

  // Render tasks array to UI
  function renderTasks() {
    const tasks = loadTasks();
    taskList.innerHTML = '';

    if (tasks.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'empty';
      empty.textContent = 'No tasks yet — add your first task above ✨';
      taskList.appendChild(empty);
      return;
    }

    tasks.forEach((task) => {
      const li = document.createElement('li');

      // Left area: checkbox + text
      const left = document.createElement('div');
      left.className = 'task-left';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = !!task.completed;
      checkbox.setAttribute('aria-label', 'Mark task completed');

      const span = document.createElement('div');
      span.className = 'task-text';
      span.textContent = task.text;
      if (task.completed) span.classList.add('completed');

      left.appendChild(checkbox);
      left.appendChild(span);

      // Right area: delete button
      const btnGroup = document.createElement('div');
      btnGroup.className = 'btn-group';

      const delBtn = document.createElement('button');
      delBtn.className = 'delete-btn';
      delBtn.textContent = 'Delete';
      delBtn.setAttribute('aria-label', 'Delete task');

      btnGroup.appendChild(delBtn);

      li.appendChild(left);
      li.appendChild(btnGroup);

      // Events
      checkbox.addEventListener('change', () => {
        toggleTaskCompletion(task.id, checkbox.checked);
      });

      delBtn.addEventListener('click', () => {
        deleteTask(task.id);
      });

      taskList.appendChild(li);
    });
  }

  // Utility: create a task object
  function createTaskObj(text) {
    return {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      text: text,
      completed: false
    };
  }

  // Add a new task
  function addTask(text) {
    const tasks = loadTasks();
    tasks.unshift(createTaskObj(text)); // newest on top
    saveTasks(tasks);
    renderTasks();
  }

  // Delete task by id
  function deleteTask(id) {
    let tasks = loadTasks();
    tasks = tasks.filter(t => t.id !== id);
    saveTasks(tasks);
    renderTasks();
  }

  // Toggle completed flag
  function toggleTaskCompletion(id, completed) {
    const tasks = loadTasks().map(t => {
      if (t.id === id) return { ...t, completed };
      return t;
    });
    saveTasks(tasks);
    renderTasks();
  }

  // Clear all tasks
  function clearAllTasks() {
    if (!confirm('Are you sure you want to remove all tasks?')) return;
    localStorage.removeItem(STORAGE_KEY);
    renderTasks();
  }

  // Event listeners
  addTaskBtn.addEventListener('click', () => {
    const value = taskInput.value.trim();
    if (!value) {
      taskInput.focus();
      return;
    }
    addTask(value);
    taskInput.value = '';
    taskInput.focus();
  });

  // Add on Enter
  taskInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addTaskBtn.click();
  });

  clearAllBtn.addEventListener('click', clearAllTasks);

  // Initial render on DOM ready
  document.addEventListener('DOMContentLoaded', renderTasks);
})();
