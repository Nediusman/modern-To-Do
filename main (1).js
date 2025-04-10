class TodoList {
            constructor() {
                this.todos = JSON.parse(localStorage.getItem('todos')) || [];
                this.currentFilter = 'all';
                this.init();
            }

            init() {
                this.render();
                document.getElementById('todoForm').addEventListener('submit', this.addTodo.bind(this));
                document.getElementById('filters').addEventListener('click', this.setFilter.bind(this));
                document.getElementById('todoList').addEventListener('click', this.handleActions.bind(this));
            }

            addTodo(e) {
                e.preventDefault();
                const input = document.querySelector('.todo-input');
                const category = document.getElementById('categorySelect').value;
                
                if (!input.value.trim()) return;

                this.todos.push({
                    id: Date.now(),
                    text: input.value.trim(),
                    category,
                    completed: false,
                    createdAt: new Date()
                });

                input.value = '';
                this.saveTodos();
                this.render();
            }

            handleActions(e) {
                const todoItem = e.target.closest('.todo-item');
                if (!todoItem) return;
                
                const id = Number(todoItem.dataset.id);
                const todo = this.todos.find(t => t.id === id);

                if (e.target.classList.contains('delete-btn')) {
                    this.todos = this.todos.filter(t => t.id !== id);
                } else if (e.target.classList.contains('toggle-btn')) {
                    todo.completed = !todo.completed;
                } else if (e.target.classList.contains('edit-btn')) {
                    const newText = prompt('Edit task:', todo.text);
                    if (newText) todo.text = newText.trim();
                }

                this.saveTodos();
                this.render();
            }

            setFilter(e) {
                if (!e.target.matches('.filter-btn')) return;
                this.currentFilter = e.target.dataset.filter;
                document.querySelectorAll('.filter-btn').forEach(btn => 
                    btn.classList.toggle('active', btn === e.target)
                );
                this.render();
            }

            saveTodos() {
                localStorage.setItem('todos', JSON.stringify(this.todos));
            }

            render() {
                const filteredTodos = this.todos.filter(todo => {
                    if (this.currentFilter === 'active') return !todo.completed;
                    if (this.currentFilter === 'completed') return todo.completed;
                    return true;
                });

                const html = filteredTodos.map(todo => `
                    <div class="todo-item" data-id="${todo.id}">
                        <div class="todo-content">
                            <button class="action-btn toggle-btn">
                                ${todo.completed ? '✅' : '⬜'}
                            </button>
                            <span style="${todo.completed ? 'opacity: 0.6; text-decoration: line-through' : ''}">
                                ${todo.text}
                            </span>
                            <span class="category-tag">${todo.category}</span>
                        </div>
                        <div class="todo-actions">
                            <button class="action-btn edit-btn">✏️</button>
                            <button class="action-btn delete-btn">🗑️</button>
                        </div>
                    </div>
                `).join('');

                document.getElementById('todoList').innerHTML = html || '<p>No tasks found!</p>';
            }
        }

        // Theme Toggle
        function toggleTheme() {
            const root = document.documentElement;
            root.setAttribute('data-theme', 
                root.getAttribute('data-theme') === 'light' ? 'dark' : 'light'
            );
        }

        // Initialize App
        const todoApp = new TodoList();

