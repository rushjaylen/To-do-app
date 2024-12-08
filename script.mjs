const API_BASE = "http://localhost:3000/api";
let currentUser = null;

async function login(username) {
    const response = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
    });
    return response.json();
}

async function getTodos(userId) {
    const response = await fetch(`${API_BASE}/users/${userId}/todos`);
    return response.json();
}

async function addTodo(userId, text) {
    const response = await fetch(`${API_BASE}/users/${userId}/todos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
    });
    return response.json();
}

async function toggleTodo(userId, todoId) {
    const response = await fetch(`${API_BASE}/users/${userId}/todos/${todoId}`, {
        method: "PATCH",
    });
    return response.json();
}

async function deleteTodo(userId, todoId) {
    await fetch(`${API_BASE}/users/${userId}/todos/${todoId}`, { method: "DELETE" });
}

// Event Handlers
document.getElementById("login-btn").addEventListener("click", async () => {
    const username = document.getElementById("username").value;
    if (!username) return alert("Please enter a username.");
    currentUser = await login(username);
    document.getElementById("login-view").style.display = "none";
    document.getElementById("todo-view").style.display = "block";
    loadTodos();
});

document.getElementById("logout-btn").addEventListener("click", () => {
    currentUser = null;
    document.getElementById("login-view").style.display = "block";
    document.getElementById("todo-view").style.display = "none";
    document.getElementById("todo-list").innerHTML = "";
});

document.getElementById("add-todo-btn").addEventListener("click", async () => {
    const text = document.getElementById("new-todo").value;
    if (!text) return alert("Please enter a task.");
    await addTodo(currentUser.id, text);
    document.getElementById("new-todo").value = "";
    loadTodos();
});

// Render Todos
async function loadTodos() {
    const todos = await getTodos(currentUser.id);
    const todoList = document.getElementById("todo-list");
    todoList.innerHTML = "";
    Object.values(todos).forEach((todo) => {
        const li = document.createElement("li");
        li.className = "todo";
        
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = todo.completed;
        checkbox.className = "todo-checkbox";
        checkbox.addEventListener("click", async () => {
            await toggleTodo(currentUser.id, todo.id);
            loadTodos();
        });

        const todoText = document.createElement("span");
        todoText.textContent = todo.text;
        todoText.className = "todo-text";
        if (todo.completed) todoText.style.textDecoration = "line-through";

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "del";
        deleteBtn.textContent = "Delete";
        deleteBtn.addEventListener("click", async () => {
            await deleteTodo(currentUser.id, todo.id);
            loadTodos();
        });

        li.appendChild(checkbox);
        li.appendChild(todoText);
        li.appendChild(deleteBtn);
        todoList.appendChild(li);
    });
}
