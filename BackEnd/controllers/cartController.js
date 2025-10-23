import _ from "lodash";
import Cart from "../models/Cart.js"; // your Cart model
// 1. addToCart.
 const addToCart = async (req, res) => {
  try {
    const { newItem, userId } = req.body;

    if (!userId) 
      return res.status(400).json({ success: false, message: "User ID is required" });

    // Find existing cart
    let userCart = await Cart.findOne({ user: userId });

    if (userCart) {
      // Check if item with same product and options already exists
      const existingItem = _.find(userCart.items, item =>
        _.isEqual(item.product.toString(), newItem.product.toString()) && // compare ObjectId as string
        _.isEqual(item.sizeOption, newItem.sizeOption)
      );

      if (existingItem) {
        // Increase quantity if exists
        existingItem.quantity += newItem.quantity;
      } else {
        // Add as new item
        userCart.items.push(newItem);
      }
      await userCart.save();
    } else {
      // Create new cart if not exist
      userCart = await Cart.create({ user: userId, items: [newItem] });
    }
       await userCart.populate({ path: "items.product" });
    return res.status(201).json({ success: true, message: "Cart updated", userCart });
  } catch (error) {
    console.error("Add to cart error:", error);
    return res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
  }
};
// 2. getCartByUserId.
const getCartByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    // also populate item.product
    const userCart = await Cart.findOne({ user: userId }).populate("items.product");
    return res.status(200).json({
      message: "User cart has been retrieved successfully",
      error: false,
      success: true,
      userCart,
    });
  } catch (error) {
  return  res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
// 3. deleteCartItemsByUserId
const deleteCartItemsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const deleteItem = req.body; // frontend sends the whole item

    // Find the user's cart
    const userCart = await Cart.findOne({ user: userId });
    if (!userCart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    // Use the _id from the embedded item to remove it
    const itemIdToDelete = deleteItem._id;
    if (!itemIdToDelete) {
      return res.status(400).json({ success: false, message: "Item _id is required" });
    }

    userCart.items = userCart.items.filter(
      (item) => item._id.toString() !== itemIdToDelete
    );

    await userCart.save();

    return res.status(200).json({
      message: "Cart item has been deleted successfully",
      success: true,
      error: false,
      userCart,
    });
  } catch (error) {
    console.error("Delete Cart Item Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
// 4. clearUserCartByUserId
const clearUserCartByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    await Cart.findOneAndUpdate({ user: userId }, { items: [] });
    return res.status(200).json({
      message: "User cart has been cleared successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
  };
export { addToCart, getCartByUserId, deleteCartItemsByUserId, clearUserCartByUserId };
