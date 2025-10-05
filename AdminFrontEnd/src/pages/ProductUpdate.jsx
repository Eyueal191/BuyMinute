import React, { useState, useEffect } from "react";
import { Form, useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Axios from "../axios/axios.config.js";
import { useDispatch, useSelector } from "react-redux";
import { setProduct } from "../redux/productSlice.js";
function ProductUpdate() {
  const product = useSelector((state) => state.products.product);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [sizeOptionCount, setSizeOptionCount] = useState(1);
  const [selectedFileName, setSelectedFileName] = useState("Choose a file...");
  const { id } = useParams();
  const navigate = useNavigate();
  const categories = ["Electronics", "Accessories", "Home", "Shoe", "Clothing"];
  const subCategories = [
    "Men", "Women", "Kids", "Wearables", "Carryables", "Gadgets",
    "Headphones and Audio", "Laptops and Computers", "Smartphones",
    "Appliances", "Furniture", "Home Decor", "Kitchenware",
  ];
  // Fetch product by id and store in Redux
  const fetchProductById = async (id) => {
    try {
      setIsLoading(true);
      const { data } = await Axios.get(`/api/product/${id}`);
      if (data.success) {
        dispatch(setProduct(data.product));
        setSizeOptionCount(data.product.sizeOption?.length || 1);
      } else {
        toast.error(data.message || "Failed to fetch product");
      }
    } catch (error) {
      toast.error(error.message || "Failed to fetch product");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (id) fetchProductById(id);
  }, [id]);
  const addSizeHandler = () => setSizeOptionCount((prev) => prev + 1);
  const submitHandler = async (e) => {
    if (updating) return;
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get("name");
    const description = formData.get("description");
    const price = formData.get("price");
    const category = formData.get("category");
    const subCategory = formData.get("subCategory");
    const images = formData.getAll("images");
    const inStock = formData.get("instock") ? true : false;
    const sizeOption = [];
    let quantity = 0;
    for (let i = 1; i <= sizeOptionCount; i++) {
      const size = formData.get(`size-${i}`);
      const additionalPrice = formData.get(`additionalPrice-${i}`);
      const stock = formData.get(`stock-${i}`);
      if (size) {
        sizeOption.push({
          size,
          additionalPrice: Number(additionalPrice) || 0,
          stock: Number(stock) || 0,
        });
        quantity += Number(stock) || 0;
      }
    }
    const productData = { name, description, price, category, subCategory, inStock, sizeOption, quantity };
    const payload = new FormData();
    payload.set("data", JSON.stringify(productData));
    images.forEach((file) => payload.append("images", file));
    try {
      setUpdating(true);
      const { data } = await Axios.put(`/api/product/${id}`, payload);
      if (data.success) {
        e.target.reset();
        setSelectedFileName("Choose a file...");
        setSizeOptionCount(1);
        toast.success(data.message);
        navigate(`/product-detail/${id}`);
      } else if (data.error) {
        throw new Error(data.error);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
      console.error(error);
    } finally {
      setUpdating(false);
    }
  };
  const deleteProductById = async () => {
    if (deleting) return;
    try {
      setDeleting(true);
      const { data } = await Axios.delete(`/api/product/${id}`);
      if (data.success) {
        toast.success(data.message || "Product deleted successfully");
        navigate("/product-list");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
      console.error(error);
    } finally {
      setDeleting(false);
    }
  };
  if (isLoading) return <p className="text-description secondary-accent-text">Loading product details...</p>;
  if (!product) return <p className="text-description secondary-accent-text">No product found.</p>;
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Form className="w-full max-w-4xl mx-auto bg-white p-6 sm:p-8 md:p-10 rounded-lg shadow-md space-y-6" onSubmit={submitHandler}>
        {/* Name */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <label htmlFor="name" className="w-32 text-label secondary-accent-text">Name:</label>
          <input type="text" id="name" name="name" defaultValue={product.name} placeholder="Enter product name..." className="flex-1 text-description px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400" />
        </div>
        {/* Description */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <label htmlFor="description" className="w-32 text-label secondary-accent-text">Description:</label>
          <textarea id="description" name="description" defaultValue={product.description} rows={4} placeholder="Enter product description..." className="flex-1 text-description px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400" />
        </div>
        {/* Category & SubCategory */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1">
            <label htmlFor="category" className="w-32 text-label secondary-accent-text">Category:</label>
            <select id="category" name="category" defaultValue={product.category} className="flex-1 text-description px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400">
              {categories.map((cat, idx) => <option key={idx} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1">
            <label htmlFor="subCategory" className="w-32 text-label secondary-accent-text">SubCategory:</label>
            <select id="subCategory" name="subCategory" defaultValue={product.subCategory} className="flex-1 text-description px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400">
              {subCategories.map((subCat, idx) => <option key={idx} value={subCat}>{subCat}</option>)}
            </select>
          </div>
        </div>
        {/* Price */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <label htmlFor="price" className="w-32 text-label secondary-accent-text">Price:</label>
          <input type="number" id="price" name="price" defaultValue={product.price} placeholder="Enter base price..." className="flex-1 text-description px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400" />
        </div>
        {/* Images */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <label className="w-32 text-label secondary-accent-text">Images:</label>
          <label className="relative flex-1 cursor-pointer flex items-center justify-center bg-gray-200 rounded-md px-4 py-2 hover:bg-gray-300 transition">
            <span className="text-description">{selectedFileName}</span>
            <input type="file" id="images" name="images" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" multiple onChange={(e) => setSelectedFileName(e.target.files[0]?.name || "Choose a file...")} />
          </label>
        </div>
        {/* In Stock */}
        <div className="flex items-center gap-2 mt-2">
          <input type="checkbox" id="instock" name="instock" defaultChecked={product.inStock} className="w-5 h-5" />
          <label htmlFor="instock" className="text-label secondary-accent-text">In Stock</label>
        </div>
        {/* Size Options */}
        <div className="space-y-2">
          <h1 className="text-main-heading">Size Options</h1>
          {Array.from({ length: sizeOptionCount }).map((_, idx) => (
            <div key={idx} className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-2 md:space-y-0">
              <div className="flex flex-col md:flex-row md:items-center md:space-x-2">
                <label htmlFor={`size-${idx + 1}`} className="text-label secondary-accent-text">Size:</label>
                <input type="text" name={`size-${idx + 1}`} id={`size-${idx + 1}`} defaultValue={product.sizeOption?.[idx]?.size || ""} placeholder={`Size ${idx + 1}`} className="text-description w-28 h-8 px-2 border border-gray-300 rounded-md" />
              </div>
              <div className="flex flex-col md:flex-row md:items-center md:space-x-2">
                <label htmlFor={`additionalPrice-${idx + 1}`} className="text-label secondary-accent-text">Additional Price:</label>
                <input type="number" name={`additionalPrice-${idx + 1}`} id={`additionalPrice-${idx + 1}`} defaultValue={product.sizeOption?.[idx]?.additionalPrice || 0} placeholder="0" className="text-description w-24 h-8 px-2 border border-gray-300 rounded-md" />
              </div>
              <div className="flex flex-col md:flex-row md:items-center md:space-x-2">
                <label htmlFor={`stock-${idx + 1}`} className="text-label secondary-accent-text">Stock:</label>
                <input type="number" name={`stock-${idx + 1}`} id={`stock-${idx + 1}`} defaultValue={product.sizeOption?.[idx]?.stock || 0} placeholder="0" className="text-description w-20 h-8 px-2 border border-gray-300 rounded-md" />
              </div>
            </div>
          ))}
        </div>
        {/* Buttons */}
        <div className="flex flex-col sm:flex-row sm:justify-between gap-4 mt-4">
          <button type="button" onClick={addSizeHandler} className="btn-secondary button-radius button-padding hover:bg-gray-900 hover:text-white">Add Size +</button>
          <button type="submit" className="btn-primary button-radius button-padding">Update Product</button>
          <button type="button" onClick={deleteProductById} className="btn-danger button-radius button-padding">Delete Product</button>
        </div>
      </Form>
    </div>
  );
};
export default ProductUpdate;
