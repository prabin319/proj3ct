const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");
const taskInput = document.getElementById("taskInput");
const dueDate = document.getElementById("dueDate");
const category = document.getElementById("category");

let tasks = [];

taskForm.addEventListener("submit", function(e) {
  e.preventDefault();

  const taskText = taskInput.value.trim();
  const date = dueDate.value;
  const cat = category.value;

  if (taskText === "" || date === "") {
    alert("Please fill in all fields.");
    return;
  }

  const task = {
    text: taskText,
    date: date,
    category: cat,
    done: false
  };

  tasks.push(task);
  renderTasks();
  taskForm.reset();
});

function renderTasks() {
  taskList.innerHTML = ""; // Clear list first

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${task.text}</strong> (${task.category}) - Due: ${task.date}
      <button onclick="deleteTask(${index})">Delete</button>
      <button onclick="toggleDone(${index})">${task.done ? "Undo" : "Done"}</button>
    `;
    if (task.done) {
      li.style.textDecoration = "line-through";
    }
    taskList.appendChild(li);
  });
}

function deleteTask(index) {
  tasks.splice(index, 1);
  renderTasks();
}

function toggleDone(index) {
  tasks[index].done = !tasks[index].done;
  renderTasks();
}

// Gallery Page

// If this is the gallery page, show filtered tasks
document.addEventListener("DOMContentLoaded", () => {
  const taskListEl = document.getElementById("filteredTaskList");
  const filterCategory = document.getElementById("filterCategory");
  const filterStatus = document.getElementById("filterStatus");

  if (taskListEl) {
    // Restore from localStorage if you add it later
    renderFilteredTasks();

    filterCategory.addEventListener("change", renderFilteredTasks);
    filterStatus.addEventListener("change", renderFilteredTasks);
  }

  function renderFilteredTasks() {
    taskListEl.innerHTML = "";

    let filtered = tasks;

    if (filterCategory.value !== "All") {
      filtered = filtered.filter(task => task.category === filterCategory.value);
    }

    if (filterStatus.value === "Done") {
      filtered = filtered.filter(task => task.done);
    } else if (filterStatus.value === "NotDone") {
      filtered = filtered.filter(task => !task.done);
    }

    if (filtered.length === 0) {
      taskListEl.innerHTML = "<li>No tasks match the filter.</li>";
    } else {
      filtered.forEach(task => {
        const li = document.createElement("li");
        li.innerHTML = `
          <strong>${task.text}</strong> (${task.category}) - Due: ${task.date}
          ${task.done ? "✅" : ""}
        `;
        taskListEl.appendChild(li);
      });
    }
  }
});
