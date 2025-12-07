const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
// Change this line
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allows frontend to hit the backend
app.use(bodyParser.json());

// Mock Database
let tasks = [
  { id: 1, text: "Build a killer portfolio", completed: false },
  { id: 2, text: "Master CSS Animations", completed: true },
];

// GET: Fetch all tasks
app.get("/tasks", (req, res) => {
  res.json(tasks);
});

// POST: Add a new task
app.post("/tasks", (req, res) => {
  const newTask = {
    id: Date.now(),
    text: req.body.text,
    completed: false,
  };
  tasks.push(newTask);
  res.json(newTask);
});

// PUT: Update task status
// PUT: Update task text OR toggle status
app.put("/tasks/:id", (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  tasks = tasks.map((task) => {
    if (task.id == id) {
      // If text is sent, update text. Otherwise, toggle completion.
      return {
        ...task,
        text: text !== undefined ? text : task.text,
        completed: text === undefined ? !task.completed : task.completed,
      };
    }
    return task;
  });
  res.json({ success: true });
});

// DELETE: Remove a task
app.delete("/tasks/:id", (req, res) => {
  const { id } = req.params;
  tasks = tasks.filter((task) => task.id != id);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
