const API_URL = 'http://localhost:5000/tasks';

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    fetchTasks();

    // NEW: Listen for "Enter" key on the input field
    const inputField = document.getElementById('taskInput');
    inputField.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });
});

// ... The rest of your code (fetchTasks, addTask, etc.) stays exactly the same below ...

async function fetchTasks() {
    const res = await fetch(API_URL);
    const tasks = await res.json();
    const list = document.getElementById('taskList');
    list.innerHTML = ''; // Clear current list
    tasks.forEach(task => renderTask(task));
}

async function addTask() {
    const input = document.getElementById('taskInput');
    const text = input.value;
    
    if (!text) return alert("Please write a task!");

    const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
    });

    const newTask = await res.json();
    renderTask(newTask);
    input.value = ''; // Clear input
}

async function toggleTask(id) {
    await fetch(`${API_URL}/${id}`, { method: 'PUT' });
    fetchTasks(); // Refresh list to show updated state
}

async function deleteTask(id, element) {
    // Add exit animation before deleting
    element.style.animation = 'fallAway 0.5s forwards';
    
    // Wait for animation to finish
    setTimeout(async () => {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        fetchTasks(); 
    }, 500);
}

function renderTask(task) {
    const list = document.getElementById('taskList');
    const li = document.createElement('li');
    
    li.className = `task-item ${task.completed ? 'completed' : ''}`;
    
    // We add contenteditable="true" to the span
    // We also add an onblur event to save when the user clicks away
    // We add an onkeypress to save when they hit Enter
    li.innerHTML = `
        <span 
            contenteditable="true" 
            onblur="updateTaskText(${task.id}, this.innerText)" 
            onkeypress="handleEnter(event, this)"
            onclick="event.stopPropagation()" 
            class="editable-text"
        >${task.text}</span>
        
        <div class="actions">
            <button class="check-btn" onclick="toggleTask(${task.id})">✔</button>
            <button class="delete-btn" onclick="deleteTask(${task.id}, this.parentNode.parentNode)">X</button>
        </div>
    `;
    
    list.appendChild(li);
}

// New function to handle text updates
async function updateTaskText(id, newText) {
    // Prevent empty tasks
    if (!newText.trim()) {
        fetchTasks(); // Revert to original if empty
        return;
    }

    await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newText })
    });
    
    // Optional: Add a subtle green flash or console log to confirm save
    console.log("Task updated!");
}

// Helper to save when pressing "Enter"
function handleEnter(e, element) {
    if (e.key === 'Enter') {
        e.preventDefault(); // Stop new line creation
        element.blur(); // Triggers the onblur event defined above
    }
}