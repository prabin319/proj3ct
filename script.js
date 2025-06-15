let tasks = [];


document.addEventListener('DOMContentLoaded', function() {

    loadTasksFromStorage();
    
 
    setupPageFunctionality();
});


function saveTasksToStorage() {
    localStorage.setItem('todoTasks', JSON.stringify(tasks));
}


function loadTasksFromStorage() {
    const savedTasks = localStorage.getItem('todoTasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    }
}

function setupPageFunctionality() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    switch(currentPage) {
        case 'main.html':
            setupMainPage();
            break;
        case 'gallery.html':
            setupGalleryPage();
            break;
        case 'contact.html':
            setupContactPage();
            break;
        default:
            break;
    }
}
function setupMainPage() {
    const taskForm = document.getElementById('taskForm');
    const taskInput = document.getElementById('taskInput');
    const dueDate = document.getElementById('dueDate');
    const category = document.getElementById('category');
    
    if (taskForm) {

        const today = new Date().toISOString().split('T')[0];
        dueDate.min = today;
        

        taskForm.addEventListener('submit', function(e) {
            e.preventDefault();
            addNewTask();
        });
        

        renderTasks();
        updateTaskCounter();
    }
}


function addNewTask() {
    const taskInput = document.getElementById('taskInput');
    const dueDate = document.getElementById('dueDate');
    const category = document.getElementById('category');
    
    const taskText = taskInput.value.trim();
    const date = dueDate.value;
    const cat = category.value;
    

    if (taskText === '') {
        alert('Please enter a task description.');
        taskInput.focus();
        return;
    }
    
    if (date === '') {
        alert('Please select a due date.');
        dueDate.focus();
        return;
    }
    
    if (cat === '') {
        alert('Please select a category.');
        category.focus();
        return;
    }

    const task = {
        id: Date.now(), 
        text: taskText,
        date: date,
        category: cat,
        done: false,
        createdAt: new Date().toISOString()
    };
    
   
    tasks.push(task);
    
   
    saveTasksToStorage();
    
    
    renderTasks();
    updateTaskCounter();
    
    
    document.getElementById('taskForm').reset();
    
    
    showNotification('Task added successfully!', 'success');
}


function renderTasks() {
    const taskList = document.getElementById('taskList');
    const noTasksMessage = document.getElementById('noTasksMessage');
    
    if (!taskList) return; 
    
    
    taskList.innerHTML = '';
    
    if (tasks.length === 0) {
        noTasksMessage.style.display = 'block';
        return;
    } else {
        noTasksMessage.style.display = 'none';
    }
    
    
    const sortedTasks = [...tasks].sort((a, b) => {
        if (a.done !== b.done) {
            return a.done ? 1 : -1; 
        }
        return new Date(a.date) - new Date(b.date); 
    });
    
    
    sortedTasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = `task-item ${task.done ? 'completed' : ''}`;
        
        const formattedDate = formatDate(task.date);
        const isOverdue = !task.done && new Date(task.date) < new Date();
        const categoryClass = `category-${task.category.toLowerCase()}`;
        
        li.innerHTML = `
            <div class="task-content">
                <div class="task-info">
                    <h4>${task.text}</h4>
                    <div class="task-details">
                        <span class="category-badge ${categoryClass}">${task.category}</span>
                        <span class="due-date ${isOverdue ? 'overdue' : ''}">${formattedDate}</span>
                        ${isOverdue ? '<span class="overdue-label">⚠️ Overdue</span>' : ''}
                    </div>
                </div>
                <div class="task-actions">
                    <button onclick="toggleTaskDone(${task.id})" class="btn ${task.done ? 'btn-secondary' : 'btn-primary'}">
                        ${task.done ? '↺ Undo' : '✓ Done'}
                    </button>
                    <button onclick="deleteTask(${task.id})" class="btn btn-secondary">🗑️ Delete</button>
                </div>
            </div>
        `;
        
        taskList.appendChild(li);
    });
}


function toggleTaskDone(taskId) {
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
        tasks[taskIndex].done = !tasks[taskIndex].done;
        saveTasksToStorage();
        renderTasks();
        updateTaskCounter();
        
        const action = tasks[taskIndex].done ? 'completed' : 'marked as pending';
        showNotification(`Task ${action}!`, 'success');
    }
}


function deleteTask(taskId) {
    if (confirm('Are you sure you want to delete this task?')) {
        const taskIndex = tasks.findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
            tasks.splice(taskIndex, 1);
            saveTasksToStorage();
            renderTasks();
            updateTaskCounter();
            showNotification('Task deleted!', 'success');
        }
    }
}


function updateTaskCounter() {
    const totalTasks = document.getElementById('totalTasks');
    const completedTasks = document.getElementById('completedTasks');
    
    if (totalTasks && completedTasks) {
        const total = tasks.length;
        const completed = tasks.filter(task => task.done).length;
        
        totalTasks.textContent = total;
        completedTasks.textContent = completed;
    }
}

function setupGalleryPage() {
    const filterCategory = document.getElementById('filterCategory');
    const filterStatus = document.getElementById('filterStatus');
    const clearFiltersBtn = document.getElementById('clearFilters');
    
    if (filterCategory && filterStatus) {
       
        renderFilteredTasks();
        updateTaskSummary();
        
        
        filterCategory.addEventListener('change', function() {
            renderFilteredTasks();
            updateResultsTitle();
        });
        
        filterStatus.addEventListener('change', function() {
            renderFilteredTasks();
            updateResultsTitle();
        });
        
       
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', function() {
                filterCategory.value = 'All';
                filterStatus.value = 'All';
                renderFilteredTasks();
                updateResultsTitle();
            });
        }
    }
}
function renderFilteredTasks() {
    const taskListEl = document.getElementById('filteredTaskList');
    const noResultsMessage = document.getElementById('noResultsMessage');
    const filterCategory = document.getElementById('filterCategory');
    const filterStatus = document.getElementById('filterStatus');
    
    if (!taskListEl) return; 
    
   
    taskListEl.innerHTML = '';
    
    
    let filtered = [...tasks];
    
    if (filterCategory.value !== 'All') {
        filtered = filtered.filter(task => task.category === filterCategory.value);
    }
    
    if (filterStatus.value === 'Done') {
        filtered = filtered.filter(task => task.done);
    } else if (filterStatus.value === 'NotDone') {
        filtered = filtered.filter(task => !task.done);
    }
    
    
    if (filtered.length === 0) {
        noResultsMessage.style.display = 'block';
        return;
    } else {
        noResultsMessage.style.display = 'none';
    }
    
    
    filtered.sort((a, b) => {
        if (a.done !== b.done) {
            return a.done ? 1 : -1;
        }
        return new Date(a.date) - new Date(b.date);
    });
    
    
    filtered.forEach(task => {
        const taskCard = document.createElement('div');
        taskCard.className = `task-item ${task.done ? 'completed' : ''}`;
        
        const formattedDate = formatDate(task.date);
        const isOverdue = !task.done && new Date(task.date) < new Date();
        const categoryClass = `category-${task.category.toLowerCase()}`;
        
        taskCard.innerHTML = `
            <div class="task-content">
                <div class="task-info">
                    <h4>${task.text}</h4>
                    <div class="task-details">
                        <span class="category-badge ${categoryClass}">${task.category}</span>
                        <span class="due-date">${formattedDate}</span>
                        ${task.done ? '<span class="status-badge completed">✅ Completed</span>' : ''}
                        ${isOverdue ? '<span class="status-badge overdue">⚠️ Overdue</span>' : ''}
                    </div>
                </div>
            </div>
        `;
        
        taskListEl.appendChild(taskCard);
    });
}
function updateTaskSummary() {
    const totalCount = document.getElementById('totalCount');
    const workCount = document.getElementById('workCount');
    const personalCount = document.getElementById('personalCount');
    const schoolCount = document.getElementById('schoolCount');
    
    if (totalCount) {
        totalCount.textContent = tasks.length;
        workCount.textContent = tasks.filter(task => task.category === 'Work').length;
        personalCount.textContent = tasks.filter(task => task.category === 'Personal').length;
        schoolCount.textContent = tasks.filter(task => task.category === 'School').length;
    }
}


function updateResultsTitle() {
    const resultsTitle = document.getElementById('resultsTitle');
    const filterCategory = document.getElementById('filterCategory');
    const filterStatus = document.getElementById('filterStatus');
    
    if (resultsTitle) {
        let title = '';
        
        if (filterCategory.value !== 'All' && filterStatus.value !== 'All') {
            title = `${filterStatus.value === 'Done' ? 'Completed' : 'Pending'} ${filterCategory.value} Tasks`;
        } else if (filterCategory.value !== 'All') {
            title = `${filterCategory.value} Tasks`;
        } else if (filterStatus.value !== 'All') {
            title = `${filterStatus.value === 'Done' ? 'Completed' : 'Pending'} Tasks`;
        } else {
            title = 'All Tasks';
        }
        
        resultsTitle.textContent = title;
    }
}