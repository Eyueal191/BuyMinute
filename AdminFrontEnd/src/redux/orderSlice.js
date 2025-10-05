import { createSlice } from "@reduxjs/toolkit";

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    ordersList: [],       // All orders
    filteredOrders: [],   // Filtered orders
    order: {},            // Single order
  },
  reducers: {
    // Set all orders
    setOrdersList: (state, action) => {
      state.ordersList = action.payload; // state is the slice state
    },

    // Set filtered orders
    setFilteredOrders: (state, action) => {
      state.filteredOrders = action.payload;
    },

    // Set a single order
    setOrder: (state, action) => {
      state.order = action.payload;
    },
  },
});

// Export action creators
export const { setOrdersList, setFilteredOrders, setOrder } = orderSlice.actions;

// Export reducer
export default orderSlice.reducer;
