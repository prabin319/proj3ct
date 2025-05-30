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
