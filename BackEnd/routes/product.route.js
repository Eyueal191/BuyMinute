import {addProduct, getProductById, getProductsList, deleteProductById, updateProductById} from "../controllers/productController.js"
import express from "express";
import upload from "../config/multer.js";
let productRoutes = express.Router()
productRoutes.post("/", upload.array("images",5),addProduct)
productRoutes.put("/:id",upload.array("images",5),updateProductById)
productRoutes.delete("/:id", deleteProductById)
productRoutes.get("/",getProductsList)
productRoutes.get("/:id",getProductById)
export default productRoutes;