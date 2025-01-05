"use strict";

document.getElementById("todo-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const todoInput = document.getElementById("todo-input");
  const timeInput = document.getElementById("time-input");
  const todoText = todoInput.value.trim();
  const todoTime = timeInput.value;

  if (todoText !== "") {
    addTodoItem(todoText, todoTime);
    todoInput.value = "";
    timeInput.value = "";
    updateProgress();
    saveToLocalStorage();
  }
});

function addTodoItem(todoText, todoTime, completed = false) {
  const todoList = document.getElementById("todo-list");
  const listItem = document.createElement("li");
  listItem.innerHTML = `
    <div class="task-container">
      <span class="task-text">${todoText}</span>
      <span class="task-time">${todoTime}</span>
    </div>
    <div class="task-buttons">
      <button class="edit-btn"><i class="fas fa-pencil-alt"></i></button>
      <button class="delete-btn"><i class="fas fa-trash-alt"></i></button>
    </div>
  `;

  if (completed) {
    listItem.classList.add("completed");
  }

  listItem.querySelector(".delete-btn").addEventListener("click", function () {
    listItem.classList.add("removing");
    setTimeout(() => {
      todoList.removeChild(listItem);
      updateProgress();
      saveToLocalStorage();
    }, 300);
  });

  listItem.querySelector(".edit-btn").addEventListener("click", function () {
    const taskText = listItem.querySelector(".task-text");
    const taskTime = listItem.querySelector(".task-time");
    const newText = prompt("Edit task:", taskText.textContent);
    const newTime = prompt("Edit time:", taskTime.textContent);
    if (newText !== null && newText.trim() !== "") {
      taskText.textContent = newText.trim();
    }
    if (newTime !== null) {
      taskTime.textContent = newTime;
    }
    saveToLocalStorage();
  });

  listItem.addEventListener("click", function () {
    listItem.classList.toggle("completed");
    updateProgress();
    saveToLocalStorage();
  });

  todoList.appendChild(listItem);
  updateProgress();
  saveToLocalStorage();
}

function updateProgress() {
  const todoList = document.getElementById("todo-list");
  const tasks = todoList.querySelectorAll("li");
  const completedTasks = todoList.querySelectorAll("li.completed").length;

  const progressCount = document.getElementById("progress-count");
  progressCount.textContent = `${completedTasks}/${tasks.length}`;

  const progressFill = document.getElementById("progress-fill");
  const progressPercent = (completedTasks / tasks.length) * 100;
  progressFill.style.width = `${progressPercent}%`;
}

function saveToLocalStorage() {
  const todoList = document.getElementById("todo-list");
  const tasks = Array.from(todoList.querySelectorAll("li")).map((li) => {
    return {
      text: li.querySelector(".task-text").textContent,
      time: li.querySelector(".task-time").textContent,
      completed: li.classList.contains("completed"),
    };
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadFromLocalStorage() {
  const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
  tasks.forEach((task) => addTodoItem(task.text, task.time, task.completed));
}

document.addEventListener("DOMContentLoaded", function () {
  loadFromLocalStorage();
  updateProgress();
});
