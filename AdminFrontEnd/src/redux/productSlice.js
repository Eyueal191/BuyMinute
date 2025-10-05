import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  productsList: [], // All products
  product: {},      // Single product
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    // Set all products
    setProductsList: (state, action) => {
      state.productsList = action.payload;
    },

    // Set single product
    setProduct: (state, action) => {
      state.product = action.payload;
    },
  },
});
// actions
export const { setProductsList, setProduct } = productSlice.actions;
// reducer
export default productSlice.reducer;
