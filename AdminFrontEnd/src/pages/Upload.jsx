import React, { useState } from "react";
import { Form } from "react-router-dom";
import { toast } from "react-toastify";
import Axios from "../axios/axios.config.js";

function Upload() {
  const categories = ["Electronics", "Accessories", "Home", "Shoe", "Clothing"];
  const subCategories = [
    "Men",
    "Women",
    "Kids",
    "Wearables",
    "Carryables",
    "Gadgets",
    "Headphones and Audio",
    "Laptops and Computers",
    "Smartphones",
    "Appliances",
    "Furniture",
    "Home Decor",
    "Kitchenware",
  ];

  const [sizeOptionCount, setSizeOptionCount] = useState(1);
  const [selectedFileName, setSelectedFileName] = useState("Choose a file...");

  const addSizeHandler = () => setSizeOptionCount((prev) => prev + 1);

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const name = formData.get("name");
    const description = formData.get("description");
    const price = formData.get("price");
    const category = formData.get("category");
    const subCategory = formData.get("subCategory");
    const images = formData.getAll("images");
    const inStock = formData.get("instock") ? true : false;

    const sizeOptions = [];
    let quantity = 0;
    for (let i = 1; i <= sizeOptionCount; i++) {
      const size = formData.get(`size-${i}`);
      const stock = formData.get(`stock-${i}`);
      if (size || stock) {
        sizeOptions.push({
          size,
          stock: Number(stock) || 0,
        });
        quantity +=Number(stock)
      }
    }

    if (!name || !description || !price || !category || !subCategory || !images.length) {
      toast.error("Please fill all the fields");
      return;
    }
    // Prepare FormData to send
    let productData = { name, description, price, category, subCategory, inStock, sizeOptions, quantity };
    const payload = new FormData();
    payload.set("data", JSON.stringify(productData));
    images.forEach((file) => payload.append("images", file));

    try {
      const response = await Axios.post("/api/product/", payload, {headers: {
    "Content-Type": "multipart/form-data",
  }});
      let data = response.data;
      if(data.success){
      Form.reset()
      toast.success(data.message)
      }
      if(data.error){
        throw new Error(data)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Upload failed");
      console.error(error);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Form
        className="w-full max-w-4xl mx-auto bg-white p-6 sm:p-8 md:p-10 rounded-lg shadow-md space-y-6"
        onSubmit={submitHandler}
      >
        {/* Product Name */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <label htmlFor="name" className="w-32 text-label secondary-accent-text">
            Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Enter product name..."
            className="flex-1 text-description px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
          />
        </div>

        {/* Product Description */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <label htmlFor="description" className="w-32 text-label secondary-accent-text">
            Description:
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            placeholder="Enter product description..."
            className="flex-1 text-description px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
          />
        </div>

        {/* Category & SubCategory */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1">
            <label htmlFor="category" className="w-32 text-label secondary-accent-text">
              Category:
            </label>
            <select
              id="category"
              name="category"
              className="flex-1 text-description px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            >
              <option value="">Select Category</option>
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1">
            <label htmlFor="subCategory" className="w-32 text-label secondary-accent-text">
              SubCategory:
            </label>
            <select
              id="subCategory"
              name="subCategory"
              className="flex-1 text-description px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            >
              <option value="">Select SubCategory</option>
              {subCategories.map((subCat, idx) => (
                <option key={idx} value={subCat}>
                  {subCat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Price & Images */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1">
            <label htmlFor="price" className="w-32 text-label secondary-accent-text">
              Price:
            </label>
            <input
              type="number"
              id="price"
              name="price"
              placeholder="Enter base price..."
              className="flex-1 text-description px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1">
            <label className="w-32 text-label secondary-accent-text">Images:</label>
            <label className="relative flex-1 cursor-pointer flex items-center justify-center bg-gray-200 rounded-md px-4 py-2 hover:bg-gray-300 transition">
              <span className="text-description">{selectedFileName}</span>
              <input
                type="file"
                id="images"
                name="images"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                multiple
                onChange={(e) =>
                  setSelectedFileName(e.target.files[0]?.name || "Choose a file...")
                }
              />
            </label>
          </div>
        </div>

        {/* In Stock */}
        <div className="flex items-center gap-2 mt-2">
          <input type="checkbox" id="instock" name="instock" className="w-5 h-5" />
          <label htmlFor="instock" className="text-label secondary-accent-text">
            In Stock
          </label>
        </div>

        {/* Size Options */}
        <div className="space-y-2">
          <h1 className="text-main-heading">Size Options</h1>
          {Array.from({ length: sizeOptionCount }).map((_, idx) => (
            <div
              key={idx}
              className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-2 md:space-y-0"
            >
              {/* Size */}
              <div className="flex flex-col md:flex-row md:items-center md:space-x-2">
                <label
                  htmlFor={`size-${idx + 1}`}
                  className="text-label secondary-accent-text"
                >
                  Size:
                </label>
                <input
                  type="text"
                  name={`size-${idx + 1}`}
                  id={`size-${idx + 1}`}
                  placeholder={`Size ${idx + 1}`}
                  className="text-description w-28 h-8 px-2 border border-gray-300 rounded-md"
                />
              </div>

              {/* Stock */}
              <div className="flex flex-col md:flex-row md:items-center md:space-x-2">
                <label
                  htmlFor={`stock-${idx + 1}`}
                  className="text-label secondary-accent-text"
                >
                  Stock:
                </label>
                <input
                  type="number"
                  name={`stock-${idx + 1}`}
                  id={`stock-${idx + 1}`}
                  placeholder="0"
                  className="text-description w-20 h-8 px-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
          <button
            type="button"
            className="bg-gray-300 text-black text-label font-medium rounded-md px-6 py-2 sm:px-8 sm:py-3 shadow-lg transition-transform hover:bg-gray-900 hover:text-white hover:scale-105 active:scale-100 duration-200"
            onClick={addSizeHandler}
          >
            Add Size +
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white text-label font-medium rounded-md px-6 py-2 sm:px-8 sm:py-3 shadow-lg transition-transform hover:bg-blue-700 hover:scale-105 active:scale-100 duration-200"
          >
            Save Product
          </button>
        </div>
      </Form>
    </div>
  );
}

export default Upload;
