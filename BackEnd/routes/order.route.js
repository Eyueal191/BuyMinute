import express from "express";
import {
  placeOrderByUserId,
  getUserOrdersByUserId,
  getAllOrders,
  deleteOrderItemByUserId,
  updateOrderItemById,
  updateUserOrderByUserId
} from "../controllers/orderController.js";

const orderRoutes = express.Router();

/**
 * Order Routes
 */

// Admin: get all orders
orderRoutes.get("/", getAllOrders);

// User: place a new order
orderRoutes.post("/user/:userId", placeOrderByUserId);

// User: get all orders by userId
orderRoutes.get("/user/:userId", getUserOrdersByUserId);

// User: update entire order (e.g., payment info, addresses, etc.)
orderRoutes.put("/user/:userId", updateUserOrderByUserId);

// Order Item: update a specific order item by itemId
orderRoutes.put("/item/:itemId", updateOrderItemById);

// Order Item: delete a specific item from a user’s order
orderRoutes.delete("/user/:userId/item/:itemId", deleteOrderItemByUserId);

export default orderRoutes;
