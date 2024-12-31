import express from "express";
import { createProduct, deleteProduct, getProductById, getProducts, getProductsByCategoryId, updateProduct } from "../controllers/productController.js";

const router = express.Router();

router.post("/", createProduct);
router.get("/", getProducts);
router.get("/:id", getProductById);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);
router.get("/category/:categoryId", getProductsByCategoryId);

export default router;
