
import test from "node:test";
import assert from "node:assert/strict";

import { registerSchema } from "../schemas/registerSchema.js";
import { taskSchema } from "../schemas/taskSchema.js";

test("valid registration data passes", () => {
  const result = registerSchema.safeParse({
    name: "Yash",
    email: "yash@example.com",
    password: "Secure123",
  });

  assert.equal(result.success, true);
});

test("invalid email fails registration", () => {
  const result = registerSchema.safeParse({
    name: "Yash",
    email: "invalid-email",
    password: "Secure123",
  });

  assert.equal(result.success, false);
});

test("short password fails registration", () => {
  const result = registerSchema.safeParse({
    name: "Yash",
    email: "yash@example.com",
    password: "123",
  });

  assert.equal(result.success, false);
});

test("priority outside the allowed range fails", () => {
  const result = taskSchema.safeParse({
    title: "Complete Day 24",
    priority: 6,
  });

  assert.equal(result.success, false);
});

test("valid task data passes", () => {
  const result = taskSchema.safeParse({
    title: "Complete Day 24",
    priority: 3,
  });

  assert.equal(result.success, true);
});

test("task priority must be a number", () => {
  const result = taskSchema.safeParse({
    title: "Complete Day 24",
    priority: "3",
  });

  assert.equal(result.success, false);
});
