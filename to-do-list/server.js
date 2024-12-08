import express from "express";
import todoManager from "./todoManager.js";

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static("public"));

// API Endpoints
app.post("/api/login", async (req, res) => {
    try {
        const { username } = req.body;
        const user = await todoManager.login(username);
        res.json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.get("/api/users/:userId/todos", async (req, res) => {
    try {
        const { userId } = req.params;
        const todos = await todoManager.getTodos(userId);
        res.json(todos);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.post("/api/users/:userId/todos", async (req, res) => {
    try {
        const { userId } = req.params;
        const { text } = req.body;
        const todo = await todoManager.addTodo(userId, { text });
        res.json(todo);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.patch("/api/users/:userId/todos/:todoId", async (req, res) => {
    try {
        const { userId, todoId } = req.params;
        const todo = await todoManager.toggleTodo(userId, todoId);
        res.json(todo);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.delete("/api/users/:userId/todos/:todoId", async (req, res) => {
    try {
        const { userId, todoId } = req.params;
        await todoManager.deleteTodo(userId, todoId);
        res.status(204).end();
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Start Server
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
