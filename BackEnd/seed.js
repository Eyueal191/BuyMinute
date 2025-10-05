import connectDB from "./config/connectDB.js";
import Category from "./models/category.js"; // adjust path if needed
import mongoose from "mongoose";

async function seedCategories() {
  try {
    // 1. Connect to DB
    await connectDB();

    // 2. Define main categories
    const categories = [
      { name: "Electronics" },
      { name: "Home & Kitchen" },
      { name: "Shoe" },
      { name: "Clothing" },
      { name: "Accessories" }
    ];

    // 3. Optional: remove existing categories to avoid duplicates
    await Category.deleteMany({});

    // 4. Insert categories
    const createdCategories = await Category.insertMany(categories);
    console.log("Categories created:", createdCategories);

    // 5. Close DB connection
    await mongoose.connection.close();
  } catch (error) {
    console.error("Error seeding categories:", error);
    process.exit(1);
  }
}

// Run the seed function
seedCategories();
