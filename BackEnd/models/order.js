import mongoose from "mongoose";

// Reusable address sub-schema
const addressSchema = new mongoose.Schema(
  {
    street: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    postalCode: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
  },
  { _id: false }
);

// Order item schema
const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: Object,
      required: true,
    },
    quantity: { type: Number, required: true, min: 1 },
    sizeOption: {
      size: { type: String, default: null },
      additionalPrice: { type: Number, default: 0 },
    },
    priceAtPurchase: { type: Number, required: true },
    status: {
      type: String,
      enum: ["processing", "shipped", "delivered", "cancelled"],
      default: "processing",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "succeeded", "failed"],
      default: "pending",
    },
    address: { type: addressSchema}, // <-- ensures address is always present
    paymentMethod: { type: String, enum: ["cod", "card"], default: "cod" },
  },
  { timestamps: true }
);

// Main order schema
const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [orderItemSchema], // array of items, each must have an address
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
