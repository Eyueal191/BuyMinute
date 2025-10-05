import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./productSlice.js";
import orderReducer from "./orderSlice.js"
const store = configureStore({
  reducer: {
    products: productReducer,
    orders:orderReducer
  },
});

export default store;
