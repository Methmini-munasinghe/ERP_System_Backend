const express = require('express');
const connectDB = require('./config/db');
const { default: Category } = require('./models/Category.js');
const { default: categoryRouter } = require('./routes/categoryRouter.js');
require('dotenv').config();

const app = express();
connectDB();

//Middleware
app.use(express.json());

//Routes
app.use('/api/categories', categoryRouter); 


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));