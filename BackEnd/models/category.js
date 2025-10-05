import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: {
        type: String, // field type
        required: true // required field
    }
}, {
    timestamps: true // automatically add createdAt and updatedAt
});
const Category = mongoose.model("Category", categorySchema);
export default Category;