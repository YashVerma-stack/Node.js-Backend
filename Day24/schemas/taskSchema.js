
import { z } from "zod";

export const taskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Task title is required")
    .max(100, "Task title cannot exceed 100 characters"),

  description: z
    .string()
    .trim()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),

  priority: z
    .number()
    .int("Priority must be an integer")
    .min(1, "Priority must be at least 1")
    .max(5, "Priority cannot exceed 5"),

  estimatedHours: z
    .number()
    .positive("Estimated hours must be greater than 0")
    .max(1000, "Estimated hours cannot exceed 1000")
    .optional(),
});
