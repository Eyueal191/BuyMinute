import { 
  addToCart, 
  getCartByUserId, 
  deleteCartItemsByUserId, 
  clearUserCartByUserId 
} from "../controllers/cartController.js";
import express from "express";

const cartRoutes = express.Router();

// 1. Add items to cart
// POST /api/cart
cartRoutes.post("/", addToCart);

// 2. Get cart by user ID
// GET /api/cart/:userId
cartRoutes.get("/:userId", getCartByUserId);

// 3. Delete a specific cart item by user ID
// DELETE /api/cart/:userId/item
cartRoutes.delete("/:userId/item", deleteCartItemsByUserId);

// 4. Clear entire cart by user ID
// DELETE /api/cart/:userId/clear
cartRoutes.delete("/:userId/clear", clearUserCartByUserId);

export default cartRoutes;
