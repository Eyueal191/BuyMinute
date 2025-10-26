import Order from "../models/Order.js";
import Stripe from "stripe";
import _ from "lodash";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// 1. placeOrderbyUserId.

const placeOrderByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const { orderItems} = req.body;
    let userOrder = await Order.findOne({ user: userId });
    if (!userOrder) {
      // Create new order if none exists
      userOrder = new Order({
        user: userId,
        items: orderItems,
      });
    } else {
      // Append new items to existing order
      userOrder.items = [...userOrder.items, ...orderItems];
    }
    await userOrder.save();
    if(orderItems[0].paymentMethod === "card"){
      const totalPrice = orderItems.reduce((acc, item)=>{
        return acc +=Number(item.priceAtPurchase);
      },0)
  const totalPriceInCents = Math.round(totalPrice*100)
  const paymentIntent = await stripe.paymentIntents.create({
  amount: totalPriceInCents,
  currency: "usd",
  payment_method_types: ["card"],
});
   const clientSecret  = paymentIntent.client_secret;
   return res.status(201).json({message:"PaymentIntent has been created", error:false, success:true, clientSecret}) 
    }
    return res.status(201).json({
      message: "Your order has been placed",
      success: true,
      error: false,
      orderId: userOrder._id,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal server error",
      success: false,
      error: true,
    });
  }
};

// 2. Get all orders for a user.

const getUserOrdersByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    let userOrders = await Order.findOne({ user: userId })
      .populate("items.product").lean();
    if (!userOrders || userOrders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No orders found for this user",
      });
    }
    // LogOrder.
    // console.log("UserOrder:", userOrders);
    return res.status(200).json({
      success: true,
      message: "Orders retrieved successfully",
      orders: userOrders,
    });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
// 3. Get all orders (admin).

const getAllOrders = async (req, res) => {
  try {
  const orders = await Order.find({})
  .populate("user") // populate user info
  .populate("items.product") // populate each product info
  .lean();
    console.log("orders", orders)
    return res.status(200).json({
      success: true,
      error: false,
      message: "Orders retrieved successfully",
      orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      message: error.message || "Internal Server Error",
    });
  }
};
// 4. Delete OrderItem from a user’s order.
const deleteOrderItemByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const { cancelItem } = req.body;
    if (!cancelItem?._id) {
      return res
        .status(400)
        .json({ success: false, message: "cancelItem._id is required" });
    }
// Find the order
    const userOrder = await Order.findOne({ user: userId });
    if (!userOrder) {
      return res
        .status(404)
        .json({ success: false, message: "User order not found" });
    }

    // Remove the item by _id
    const itemsCount = userOrder.items.length;
    userOrder.items = userOrder.items.filter(
      (item) => item._id.toString() !== cancelItem._id
    );

    if (itemsCount === userOrder.items.length) {
      return res.status(400).json({
        success: false,
        message: "Order could not be cancelled (no matching item found)",
      });
    }

    await userOrder.save();

    return res.status(200).json({
      success: true,
      message: "The order has been cancelled successfully from your order list",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

// 5. Update order by ID. for the admin

const updateOrderItemById = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { userId, itemUpdate } = req.body;
    // Find the order
    console.log("itemId",itemId);
    console.log("userId", userId);
    console.log("itemUpdate", itemUpdate)
    const order = await Order.findOne({ user: userId });
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Find the subdocument (order item)
    const item = order.items.id(itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: "Order item not found" });
    }

    // Apply updates to subdocument
    Object.assign(item, itemUpdate);

    // Save parent (subdoc auto-saved)
    await order.save();

    return res.status(200).json({
      message: "Order has been updated successfully",
      success: true,
      error: false,
      updatedItem: item
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

 // 6. updateUserOrderByUserId.

const updateUserOrderByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const { paymentUpdatedItems, oldItems } = req.body;

    // Find the user's order
    let userOrder = await Order.findOne({ user: userId });
    if (!userOrder) {
      return res.status(404).json({ message: "Order not found", success: false, error:true });
    }

    // Remove old items
    userOrder.items = userOrder.items.filter(
      (item) => !oldItems.some(oldItem => oldItem._id.toString() === item._id.toString())
    );

    // Add updated items
    userOrder.items = [...userOrder.items, ...paymentUpdatedItems];

    // Save updated order
    await userOrder.save();

    return res.status(200).json({
      message: "Order has been updated",
      success: true,
      error: false,
      order: userOrder,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
export {
  updateUserOrderByUserId,
  placeOrderByUserId,
  getUserOrdersByUserId,
  getAllOrders,
  deleteOrderItemByUserId,
  updateOrderItemById,
};
