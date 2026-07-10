import express from "express";
import cors from "cors";
import { Todo } from "../models/index.js";

const app = express();

app.use(cors());
app.use(express.json());

// GET /todos – list all todos
app.get("/todos", async (req, res, next) => {
  try {
    const todos = await Todo.findAll({
      order: [["createdAt", "DESC"]],
    });
    return res.status(200).json(todos);
  } catch (error) {
    return next(error);
  }
});

// POST /todos – create a new todo
app.post("/todos", async (req, res, next) => {
  try {
    const { title, description, completed } = req.body;

    // Validation
    if (!title || typeof title !== "string" || title.trim() === "") {
      return res.status(400).json({
        error: "Validation Error",
        message: "Title is required and cannot be empty.",
      });
    }

    const newTodo = await Todo.create({
      title: title.trim(),
      description: description ? description.trim() : null,
      completed: !!completed,
    });

    return res.status(201).json(newTodo);
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        error: "Validation Error",
        message: error.errors.map((e) => e.message).join(", "),
      });
    }
    return next(error);
  }
});

// PUT /todos/:id – update a todo
app.put("/todos/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;

    const todo = await Todo.findByPk(id);
    if (!todo) {
      return res.status(404).json({
        error: "Not Found",
        message: `Todo with ID ${id} not found.`,
      });
    }

    // Validate title
    if (title !== undefined) {
      if (typeof title !== "string" || title.trim() === "") {
        return res.status(400).json({
          error: "Validation Error",
          message: "Title cannot be empty.",
        });
      }
      todo.title = title.trim();
    }

    if (description !== undefined) {
      todo.description = description ? description.trim() : null;
    }

    if (completed !== undefined) {
      todo.completed = !!completed;
    }

    await todo.save();
    return res.status(200).json(todo);
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        error: "Validation Error",
        message: error.errors.map((e) => e.message).join(", "),
      });
    }
    return next(error);
  }
});

// DELETE /todos/:id – delete a todo
app.delete("/todos/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const todo = await Todo.findByPk(id);
    if (!todo) {
      return res.status(404).json({
        error: "Not Found",
        message: `Todo with ID ${id} not found.`,
      });
    }

    await todo.destroy();
    return res.status(200).json({
      message: "Todo successfully deleted.",
      id: parseInt(id, 10),
    });
  } catch (error) {
    return next(error);
  }
});

// 404 Route handler
app.use((req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: `Endpoint ${req.method} ${req.url} does not exist.`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled Server Error:", err);
  res.status(500).json({
    error: "Internal Server Error",
    message: err.message || "Something went wrong on the server.",
  });
});

export default app;
