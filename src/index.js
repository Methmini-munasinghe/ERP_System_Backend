import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import cors from 'cors';
import categoryRouter from './routes/categoryRouter.js';
import productRouter from './routes/productRouter.js'; 
import authRoutes from "./routes/authRoutes.js";
import categoryRouter from "./routes/categoryRouter.js";
import productRouter from "./routes/ProductRoutes.js"; 
import supplierRoutes from "./routes/supplierRoutes.js";
import purchaseOrderRoutes from "./routes/purchaseOrderRoutes.js"; 
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import dotenv from "dotenv";
dotenv.config();


const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use(cors());

app.get("/", (req, res) => res.send("API is running "));
app.use("/api/auth", authRoutes);
app.use('/api/categories', categoryRouter); 
app.use('/api/products', productRouter); 
app.use("/api/purchase-orders", purchaseOrderRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} `));
