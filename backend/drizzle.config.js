import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  out: "./drizzle",
  schema: "./models/user.model.js",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
