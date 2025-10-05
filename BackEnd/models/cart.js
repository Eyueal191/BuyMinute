import mongoose from "mongoose";
const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // 1:1 link with User
    required: true,
    unique: true // ensures one cart per user
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
      },
      quantity: {
        type: Number,
        default: 1,
        min: 1
      },
      sizeOption: {
        size: String,          // optional
        additionalPrice: Number // optional
      },
      
    }
  ],
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // automatically adds createdAt & updatedAt
});

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
