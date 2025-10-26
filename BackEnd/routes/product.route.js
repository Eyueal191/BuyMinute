import {addProduct, getProductById, getProductsList, deleteProductById, updateProductById} from "../controllers/productController.js"
import express from "express";
import upload from "../config/multer.js";
import { ensureAuthenticatedAdmin } from "../middleware/auth.js";
let productRoutes = express.Router()
productRoutes.post("/",upload.array("images",5),addProduct)
productRoutes.put("/:id",ensureAuthenticatedAdmin, upload.array("images",5),updateProductById)
productRoutes.delete("/:id",ensureAuthenticatedAdmin, deleteProductById)
productRoutes.get("/",getProductsList)
productRoutes.get("/:id",getProductById)
export default productRoutes;