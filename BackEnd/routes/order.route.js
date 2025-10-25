import express from "express";
import {
  placeOrderByUserId,
  getUserOrdersByUserId,
  getAllOrders,
  deleteOrderItemByUserId,
  updateOrderItemById,
  updateUserOrderByUserId
} from "../controllers/orderController.js";
import { ensureAuthenticatedAdmin } from "../middleware/auth.js";
const orderRoutes = express.Router();
// Order Routes.
// Admin: get all orders.
orderRoutes.get("/", getAllOrders);
// User: place a new orderItem.
orderRoutes.post("/user/:userId", placeOrderByUserId);
// User: get all orders by userId.
orderRoutes.get("/user/:userId", getUserOrdersByUserId);
// User: update entire orderItem (e.g., payment info, addresses, etc).
orderRoutes.put("/user/:userId", updateUserOrderByUserId);
// Order Item: update a user orderItem by itemId.
orderRoutes.put("/user/:userId/:itemId", updateOrderItemById);
// Order Item: delete a specific item from a user’s order.
orderRoutes.delete("/user/:userId/", deleteOrderItemByUserId);
export default orderRoutes;
