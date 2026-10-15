import express from "express";
import requestLogger from "./middleware/requestLogger.js";
import apiKeyAuth from "./middleware/apiKeyAuth.js";
import morgan from 'morgan';
import cors from "cors";
import errorHandler from "./middleware/errorHandler.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ["Content-Type", 'x-api-key'],
  })
);

app.use(express.json());

// Morgan HTTP request logging
app.use(morgan('dev'));

// Application-level middleware
app.use(requestLogger);

app.use((req, res, next) => {
  console.log("Application-level middleware executed");
  next();
});

// Route-level middleware
function checkTaskAccess(req, res, next) {
  console.log("Task route middleware executed");
  next();
}

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Day 13",
  });
});

app.get("/api/tasks", checkTaskAccess, (req, res) => {
  res.json([
    { id: 1, title: "Learn middleware" },
    { id: 2, title: "Learn Express routing" },
  ]);
});

// Protected route
app.get('/api/tasks/protected', apiKeyAuth, (req, res) => {
  res.json({
    success: true,
    message: "Access granted! You provied a valid API key.",
  });
});

app.get('/api/error-demo', (req, res, next) => {
  const error = new Error("Something went wrong!");

  error.statusCode = 400;

  next(error);
});

// keep this after all routes
app.use(errorHandler);

export default app;
