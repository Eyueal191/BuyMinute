import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [],   // all products
    product: {}     // single product details
  },
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    setProduct: (state, action) => {
      state.product = action.payload;
    }
  }
});
// Export actions
export const { setProducts, setProduct } = productSlice.actions;
// Export reducer
export default productSlice.reducer;
