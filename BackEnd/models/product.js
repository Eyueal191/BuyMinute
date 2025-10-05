import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    subCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubCategory",
        required: true
    },
    images: [{
        type: String
    }],
    quantity: {
        type: Number,
        required: true
    },
    sizeOption: [{
        size: {
            type: String,
            required: true
        },
        additionalPrice: {
            type: Number,
            default: 0
        },
        stock: {
            type: Number,
            default: 0
        }
    }],
    inStock: {
        type: Boolean,
        default: true
    },
    rating: {
        type: Number,
        default: 0
    },
    numReviews: {
        type: Number,
        default: 0
    },
    reviews: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        comment: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

// 🔍 Add full-text index
productSchema.index({ name: "text", description: "text" });

const Product = mongoose.model("Product", productSchema);
export default Product;
