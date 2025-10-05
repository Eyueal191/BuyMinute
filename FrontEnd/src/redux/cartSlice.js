import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "userCart",
  initialState: {
    userCart: {
      user: null,
      items: [],
    },
  },
  reducers: {
    setUserCart: (state, action) => {
      state.userCart = action.payload; // update userCart
    },
  },
});

// Export the action creator
export const { setUserCart } = cartSlice.actions;

// Export the reducer
export default cartSlice.reducer;
