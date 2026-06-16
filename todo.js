// To-Do List Application with Local Storage

class TodoApp {
  constructor() {
    this.tasks = this.loadTasks();
    this.filter = 'all';
    this.init();
  }
  
  init() {
    this.setupEventListeners();
    this.render();
  }
  
  setupEventListeners() {
    document.getElementById('add-btn').addEventListener('click', () => this.addTask());
    document.getElementById('task-input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.addTask();
    });
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this.filter = e.target.dataset.filter;
        this.render();
      });
    });
    
    document.getElementById('clear-all-btn').addEventListener('click', () => this.clearCompleted());
  }
  
  addTask() {
    const input = document.getElementById('task-input');
    const text = input.value.trim();
    
    if (text === '') {
      alert('Please enter a task!');
      return;
    }
    
    const task = {
      id: Date.now(),
      text: text,
      completed: false,
      createdAt: new Date().toLocaleDateString()
    };
    
    this.tasks.push(task);
    this.saveTasks();
    input.value = '';
    this.render();
  }
  
  deleteTask(id) {
    this.tasks = this.tasks.filter(task => task.id !== id);
    this.saveTasks();
    this.render();
  }
  
  toggleTask(id) {
    const task = this.tasks.find(t => t.id === id);
    if (task) {
      task.completed = !task.completed;
      this.saveTasks();
      this.render();
    }
  }
  
  clearCompleted() {
    this.tasks = this.tasks.filter(task => !task.completed);
    this.saveTasks();
    this.render();
  }
  
  getFilteredTasks() {
    switch(this.filter) {
      case 'active':
        return this.tasks.filter(task => !task.completed);
      case 'completed':
        return this.tasks.filter(task => task.completed);
      default:
        return this.tasks;
    }
  }
  
  updateStats() {
    const total = this.tasks.length;
    const completed = this.tasks.filter(t => t.completed).length;
    const remaining = total - completed;
    
    document.getElementById('total-tasks').textContent = total;
    document.getElementById('completed-tasks').textContent = completed;
    document.getElementById('remaining-tasks').textContent = remaining;
  }
  
  render() {
    const tasksList = document.getElementById('tasks-list');
    const filteredTasks = this.getFilteredTasks();
    
    this.updateStats();
    
    if (filteredTasks.length === 0) {
      tasksList.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📭</div>
          <p>No tasks here yet!</p>
        </div>
      `;
      return;
    }
    
    tasksList.innerHTML = filteredTasks.map(task => `
      <div class="task-item ${task.completed ? 'completed' : ''}">
        <input 
          type="checkbox" 
          class="task-checkbox" 
          ${task.completed ? 'checked' : ''}
          onchange="app.toggleTask(${task.id})"
        />
        <span class="task-text">${this.escapeHtml(task.text)}</span>
        <span class="task-date">${task.createdAt}</span>
        <button class="delete-btn" onclick="app.deleteTask(${task.id})">Delete</button>
      </div>
    `).join('');
  }
  
  saveTasks() {
    localStorage.setItem('todoTasks', JSON.stringify(this.tasks));
  }
  
  loadTasks() {
    const stored = localStorage.getItem('todoTasks');
    return stored ? JSON.parse(stored) : [];
  }
  
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Initialize app
const app = new TodoApp();