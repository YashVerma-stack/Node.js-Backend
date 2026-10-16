import dotenv from "dotenv";

dotenv.config();

export const PORT = Number(process.env.PORT) || 3000;

export const NODE_ENV = process.env.NODE_ENV || "development";

export const API_KEY = process.env.API_KEY;


