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