import { nanoid } from "nanoid";

const usersByUsername = new Map();
const todosByUserId = new Map();

export async function login(username) {
    if (!username) throw new Error("Username is required.");
    let user = usersByUsername.get(username);
    if (user) return user;

    user = { id: nanoid(), username };
    usersByUsername.set(username, user);
    todosByUserId.set(user.id, new Map());
    return user;
}

export async function getTodos(userId) {
    if (!todosByUserId.has(userId)) throw new Error("User not found.");
    const todos = todosByUserId.get(userId);
    return Object.fromEntries(todos);
}

export async function addTodo(userId, todo) {
    if (!todosByUserId.has(userId)) throw new Error("User not found.");
    const todos = todosByUserId.get(userId);
    const id = nanoid();
    todos.set(id, { id, text: todo.text, completed: false });
    return todos.get(id);
}

export async function toggleTodo(userId, todoId) {
    if (!todosByUserId.has(userId)) throw new Error("User not found.");
    const todos = todosByUserId.get(userId);
    const todo = todos.get(todoId);
    if (!todo) throw new Error("Todo not found.");
    todo.completed = !todo.completed;
    return todo;
}

export async function deleteTodo(userId, todoId) {
    if (!todosByUserId.has(userId)) throw new Error("User not found.");
    const todos = todosByUserId.get(userId);
    if (!todos.has(todoId)) throw new Error("Todo not found.");
    todos.delete(todoId);
}

export default { login, getTodos, addTodo, toggleTodo, deleteTodo };
