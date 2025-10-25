import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true, // each email must be unique
        lowercase: true, // store email in lowercase for consistency
        trim: true,
    },
    bio:{
          type: String
    },
    password: {
        type: String,
        required: true,
    },
    role:{
        type:String,
        enum:["Admin","User"],
        default:"User"
    },
    verified: {
        type: Boolean,
        default: false,
    },
    verifyEmailOTP: {
        type: Number,
    },
    verifyEmailOTPExpiry: {
        type: Date,
    },
    verifyPasswordOTP: {
        type: Number,
    },
    verifyPasswordOTPExpiry: {
        type: Date,
    },
    accessToken: {
        type: String,
    },
    refreshToken: {
        type: String,
    },
    profileImage: {
        type: String,
        default: "", // optional
    },
 phone:{type:String,
    default:""
 },
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Orders", // reference to Orders collection
    }, ],
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cart", // reference to Cart collection
    },
}, {
    timestamps: true, // adds createdAt & updatedAt automatically
});

const User = mongoose.model("User", userSchema);

export default User;