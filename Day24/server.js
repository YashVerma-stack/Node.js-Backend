import express from "express";
import { registerSchema } from "./schemas/registerSchema.js";
import { validate } from "./middlewares/validate.js";
import { taskSchema } from "./schemas/taskSchema.js";

const app = express();

app.use(express.json());

app.post(
  "/api/auth/register",
  validate(registerSchema),
  (req, res) => {
    res.status(201).json({
      success: true,
      message: "Registration input validated successfully",
      data: req.body,
    });
  }
);

app.post("/api/tasks", validate(taskSchema), (req, res) => {
  res.status(201).json({
    success: true,
    message: "Task input validated successfully",
    data: req.body,
  });
});


app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
