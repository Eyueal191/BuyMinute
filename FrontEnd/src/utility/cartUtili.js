// utils/cartUtils.js
import Axios from "../axios/axios.config.js";
import { setUserCart } from "../redux/cartSlice.js";
import toast from "react-hot-toast";

// Fetch user cart
export const getUserCart = async (userId, dispatch) => {
  try {
    const response = await Axios.get(`/api/cart/${userId}`);
    const data = response.data;

    if (data.success) {
      dispatch(setUserCart(data.userCart || { user: userId, items: [] }));
    }
    return data.userCart || { user: userId, items: [] };
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to fetch UserCart");
    throw error;
  }
};
// Clear user cart
export const clearUserCart = async (userId, dispatch) => {
  try {
    const response = await Axios.delete(`/api/cart/${userId}/clear`);
    const data = response.data;

    if (data.success) {
      toast.success(data.message);
      await getUserCart(userId, dispatch); // refresh cart after clearing
    }
    return data;
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to clear UserCart");
    throw error;
  }
};
