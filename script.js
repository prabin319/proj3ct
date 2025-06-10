// Global variables
let tasks = [];

// Wait for the page to load completely
document.addEventListener('DOMContentLoaded', function() {
    // Load tasks from localStorage when page loads
    loadTasksFromStorage();
    
    // Set up different page functionality based on current page
    setupPageFunctionality();
});

// Save tasks to localStorage
function saveTasksToStorage() {
    localStorage.setItem('todoTasks', JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasksFromStorage() {
    const savedTasks = localStorage.getItem('todoTasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    }
}

// Determine which page we're on and set up appropriate functionality
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
            // For index.html and about.html, no special setup needed
            break;
    }
}
// ==================== MAIN PAGE FUNCTIONALITY ====================
function setupMainPage() {
    const taskForm = document.getElementById('taskForm');
    const taskInput = document.getElementById('taskInput');
    const dueDate = document.getElementById('dueDate');
    const category = document.getElementById('category');
    
    if (taskForm) {
        // Set minimum date to today
        const today = new Date().toISOString().split('T')[0];
        dueDate.min = today;
        
        // Handle form submission
        taskForm.addEventListener('submit', function(e) {
            e.preventDefault();
            addNewTask();
        });
        
        // Render existing tasks
        renderTasks();
        updateTaskCounter();
    }
}

// Add a new task
function addNewTask() {
    const taskInput = document.getElementById('taskInput');
    const dueDate = document.getElementById('dueDate');
    const category = document.getElementById('category');
    
    const taskText = taskInput.value.trim();
    const date = dueDate.value;
    const cat = category.value;
    
    // Validation
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
    
    // Create new task object
    const task = {
        id: Date.now(), // Simple ID based on timestamp
        text: taskText,
        date: date,
        category: cat,
        done: false,
        createdAt: new Date().toISOString()
    };
    
    // Add to tasks array
    tasks.push(task);
    
    // Save to localStorage
    saveTasksToStorage();
    
    // Update display
    renderTasks();
    updateTaskCounter();
    
    // Reset form
    document.getElementById('taskForm').reset();
    
    // Show success message
    showNotification('Task added successfully!', 'success');
}

// Render all tasks on the main page
function renderTasks() {
    const taskList = document.getElementById('taskList');
    const noTasksMessage = document.getElementById('noTasksMessage');
    
    if (!taskList) return; // Not on main page
    
    // Clear existing tasks
    taskList.innerHTML = '';
    
    if (tasks.length === 0) {
        noTasksMessage.style.display = 'block';
        return;
    } else {
        noTasksMessage.style.display = 'none';
    }
    
    // Sort tasks: incomplete first, then by due date
    const sortedTasks = [...tasks].sort((a, b) => {
        if (a.done !== b.done) {
            return a.done ? 1 : -1; // Incomplete tasks first
        }
        return new Date(a.date) - new Date(b.date); // Then by due date
    });
    
    // Create task elements
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

// Toggle task completion status
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

// Delete a task
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

// Update task counter
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

// ==================== GALLERY PAGE FUNCTIONALITY ====================
function setupGalleryPage() {
    const filterCategory = document.getElementById('filterCategory');
    const filterStatus = document.getElementById('filterStatus');
    const clearFiltersBtn = document.getElementById('clearFilters');
    
    if (filterCategory && filterStatus) {
        // Render filtered tasks on page load
        renderFilteredTasks();
        updateTaskSummary();
        
        // Add event listeners for filters
        filterCategory.addEventListener('change', function() {
            renderFilteredTasks();
            updateResultsTitle();
        });
        
        filterStatus.addEventListener('change', function() {
            renderFilteredTasks();
            updateResultsTitle();
        });
        
        // Clear filters button
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

// Render filtered tasks in gallery view
function renderFilteredTasks() {
    const taskListEl = document.getElementById('filteredTaskList');
    const noResultsMessage = document.getElementById('noResultsMessage');
    const filterCategory = document.getElementById('filterCategory');
    const filterStatus = document.getElementById('filterStatus');
    
    if (!taskListEl) return; // Not on gallery page
    
    // Clear existing tasks
    taskListEl.innerHTML = '';
    
    // Apply filters
    let filtered = [...tasks];
    
    if (filterCategory.value !== 'All') {
        filtered = filtered.filter(task => task.category === filterCategory.value);
    }
    
    if (filterStatus.value === 'Done') {
        filtered = filtered.filter(task => task.done);
    } else if (filterStatus.value === 'NotDone') {
        filtered = filtered.filter(task => !task.done);
    }
    
    // Show/hide no results message
    if (filtered.length === 0) {
        noResultsMessage.style.display = 'block';
        return;
    } else {
        noResultsMessage.style.display = 'none';
    }
    
    // Sort filtered tasks
    filtered.sort((a, b) => {
        if (a.done !== b.done) {
            return a.done ? 1 : -1;
        }
        return new Date(a.date) - new Date(b.date);
    });
    
    // Create task cards
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
