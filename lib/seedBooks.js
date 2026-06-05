import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { connectDB } from "./mongodb.js";
import Book from "../models/Book.js";
import books from "./books.js";

async function seed() {
  try {
    await connectDB();

    await Book.deleteMany({});
    await Book.insertMany(books);

    console.log("Books seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }
}

seed();