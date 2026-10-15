
import express from "express";
import apiKeyAuth from "../middleware/apiKeyAuth.js";

const router = express.Router();

let tasks = [
  { id: 1, title: "Learn Express middleware", completed: true },
  { id: 2, title: "Build Task API", completed: false },
];

let nextId = 3;

// GET all tasks
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    count: tasks.length,
    data: tasks,
  });
});

// GET a task by ID
router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find((task) => task.id === id);

  if (!task) {
    return res.status(404).json({
      success: false,
      message: "Task not found",
    });
  }

  res.status(200).json({
    success: true,
    data: task,
  });
});

// Create a task — API key required
router.post("/", apiKeyAuth, (req, res, next) => {
  const { title } = req.body;

  if (typeof title !== "string" || !title.trim()) {
    const error = new Error("A valid task title is required");
    error.statusCode = 400;
    return next(error);
  }

  const task = {
    id: nextId++,
    title: title.trim(),
    completed: false,
  };

  tasks.push(task);

  res.status(201).json({
    success: true,
    data: task,
  });
});


router.patch("/:id", apiKeyAuth, (req, res, next) => {
  const id = Number(req.params.id);
  const task = tasks.find((task) => task.id === id);

  if (!task) {
    const error = new Error("Task not found");
    error.statusCode = 404;
    return next(error);
  }

  const { title, completed } = req.body;

  if (
    title !== undefined &&
    (typeof title !== "string" || !title.trim())
  ) {
    const error = new Error("Title must be a non-empty string");
    error.statusCode = 400;
    return next(error);
  }

  if (
    completed !== undefined &&
    typeof completed !== "boolean"
  ) {
    const error = new Error("Completed must be a boolean");
    error.statusCode = 400;
    return next(error);
  }

  if (title !== undefined) {
    task.title = title.trim();
  }

  if (completed !== undefined) {
    task.completed = completed;
  }

  res.status(200).json({
    success: true,
    message: "Task updated successfully",
    data: task,
  });
});


router.delete("/:id", apiKeyAuth, (req, res, next) => {
  const id = Number(req.params.id);
  const taskIndex = tasks.findIndex((task) => task.id === id);

  if (taskIndex === -1) {
    const error = new Error("Task not found");
    error.statusCode = 404;
    return next(error);
  }

  const deletedTask = tasks.splice(taskIndex, 1)[0];

  res.status(200).json({
    success: true,
    message: "Task deleted successfully",
    data: deletedTask,
  });
});



export default router;
