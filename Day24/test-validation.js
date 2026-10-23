import { registerSchema } from "./schemas/registerSchema.js";

const validInput = {
  name: "Yash",
  email: "yash@example.com",
  password: "Secure123",
};

const result = registerSchema.safeParse(validInput);

if (result.success) {
  console.log("Validation successful!");
  console.log(result.data);
} else {
  console.log("Validation failed!");
  console.log(result.error.issues);
}
