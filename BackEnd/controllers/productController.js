import Product from "../models/product.js"
import Category from "../models/category.js"
import SubCategory from "../models/subcategory.js"
import uploadMultipleFiles from "../utility/uploadMultipleFiles.js"
//1. createProduct.
const addProduct = async (req, res) => {
    try {
        let data = req.body.data;
        let productData = JSON.parse(data)
        const files = req.files || [];

        // Upload files to Cloudinary
        const imageUrls = files.length > 0 ? await uploadMultipleFiles(files) : [];

        // Get Category & SubCategory IDs
        const categoryDoc = await Category.findOne({ name: productData.category });
        const subCategoryDoc = await SubCategory.findOne({ name: productData.subCategory });

        if (!categoryDoc || !subCategoryDoc) {
            return res.status(400).json({
                message: "Invalid category or subcategory",
                error: true,
                success: false
            });
        }

        // Check for existing product
        const existingProduct = await Product.findOne({
            name: productData.name,
            description: productData.description
        });
        if (existingProduct) {
            return res.status(409).json({
                message: "Product already exists",
                error: true,
                success: false
            });
        }

        // Create new product
        const newProduct = new Product({
            ...productData,
            category: categoryDoc._id,
            subCategory: subCategoryDoc._id,
            images: imageUrls
        });

        await newProduct.save();

        res.status(201).json({
            message: "Product created successfully",
            error: false,
            success: true,
            product: newProduct
        });

    } catch (error) {
        res.status(500).json({
            message: error.message || "Internal Server Error",
            error: true,
            success: false
        });
    }
};
//2. getProductById.
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id)
            .populate("category", "name")
            .populate("subCategory", "name");

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
                error: true,
                success: false
            });
        }

        return res.status(200).json({
            message: "Product retrieved successfully",
            error: false,
            success: true,
            product
        });
    } catch (error) {
        res.status(500).json({
            message: error.message || "Internal Server Error",
            error: true,
            success: false
        });
    }
};

// 3. getProductsList

const getProductsList = async (req, res) => {
  try {
    // 1️⃣ Destructure query parameters with defaults
    const {
      search = "",
      selectedCategories: rawSelectedCategories = "[]",
      selectedSubCategories: rawSelectedSubCategories = "[]",
      priceMin = 0,
      priceMax,
    } = req.query;

    // 2️⃣ Parse selected categories and subcategories
    let selectedCategories = JSON.parse(rawSelectedCategories);
    let selectedSubCategories = JSON.parse(rawSelectedSubCategories);

    // 3️⃣ Map subcategory and category names to IDs
    const subCategoriesDocs = await SubCategory.find({
      name: { $in: selectedSubCategories },
    });
    const categoriesDocs = await Category.find({
      name: { $in: selectedCategories },
    });

    const subCategoryIdLists = subCategoriesDocs.map((doc) => doc._id);
    const categoryIdLists = categoriesDocs.map((doc) => doc._id);

    // 4️⃣ Build dynamic query
    const query = { price: { $gte: Number(priceMin) } };
    if (priceMax) query.price.$lte = Number(priceMax);
    if (categoryIdLists.length > 0) query.category = { $in: categoryIdLists };
    if (subCategoryIdLists.length > 0)
      query.subCategory = { $in: subCategoryIdLists };

    // 5️⃣ Add text search if present.

if (search.trim() !== "") {
  let searchRegex = new RegExp(search.trim(), "i");
  query.$or = [
    { name: searchRegex },
    { description: searchRegex }
  ];
}  
// 6️⃣ Fetch products and populate relations.

    const productsList = await Product.find(query)
      .populate({ path: "category", select: "name" })
      .populate({ path: "subCategory", select: "name" });

    // 7️⃣ Send response
    res.status(200).json({
      message:
        search.trim() !== ""
          ? "Searched product list retrieved successfully"
          : "Filtered products list retrieved successfully",
      error: false,
      success: true,
      products: productsList,
    });
  } catch (error) {
    console.error("getProductsList error:", error);
    res.status(500).json({
      message: error.message || "Internal Server Error",
      error: true,
      success: false,
    });
  }
};


//4. deleteProductById.
const deleteProductById = async (req, res) => {
    try {
        const {
            id
        } = req.params; // safer to get id from URL params

        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Product deleted successfully",
            deletedProduct,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
};
//5. updateProductById.
const updateProductById = async (req, res) => {
  try {
    const { id } = req.params; // safer to get id from URL
    const files = req.files || [];

    // Upload new files to Cloudinary
    const imageUrls = files.length > 0 ? await uploadMultipleFiles(files) : [];

    // Parse updates from request body
    const data = req.body.data;
    let updates = JSON.parse(data);

    // Find category and subCategory documents
    const categoryDoc = await Category.findOne({ name: updates.category });
    const subCategoryDoc = await SubCategory.findOne({ name: updates.subCategory });

    // Merge updates with category/subCategory IDs and uploaded images
    updates = {
      ...updates,
      category: categoryDoc?._id || updates.category,
      subCategory: subCategoryDoc?._id || updates.subCategory,
    };

    // Preserve old images if no new images are uploaded
    const oldProduct = await Product.findById(id);
    if (!oldProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    updates.images = imageUrls.length > 0 ? imageUrls : oldProduct.images;

    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(id, updates, {
      new: true,           // return the updated document
      runValidators: true, // apply schema validators
    });

    res.status(200).json({
      success: true,
      message: `Product ${updatedProduct.name} updated successfully`,
      product: updatedProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
export {addProduct, getProductById, getProductsList, deleteProductById, updateProductById};