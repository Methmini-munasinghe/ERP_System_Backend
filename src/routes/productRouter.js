import { upload } from "../config/cloudinary.js";
import express from 'express';
import { deleteProduct,getAllProducts,getProductById, updateProduct } from "../controllers/productController.js";
import Product from "../models/Product.js";


const productRouter = express.Router();
//category routes



//get all products
productRouter.get('/getAll',getAllProducts);
//get product by id
productRouter.get('/:id', getProductById);
// update product
productRouter.put('/:id', 
    upload.fields([
        { name: "mainImage", maxCount: 1 },
        { name: "additionalImages", maxCount: 3 }
    ]), 
    updateProduct
);
//delete product
productRouter.delete('/:id', deleteProduct );


export default productRouter;