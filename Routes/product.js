import express from "express";
import { addProduct, deleteProduct, editProduct, findOneProduct, getProduct } from "../Controllers/product.js";

const router = express.Router();

router.post("/add", addProduct);

router.get("/getall", getProduct);

router.delete("/deleteone/:productId", deleteProduct);

router.get("/findone/:productId", findOneProduct);

router.put("/editone/:productId", editProduct);


export const productRouter = router;