import Product from "../models/Product.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import {cloudinary} from "../config/cloudinary.js";

//get all products

export const getAllProducts = asyncErrorHandler(async (req, res, next) => {
    const products = await Product.find({ isActive: true })
        .populate('categoryId', 'categoryName')
        .sort({ createdAt: -1 });

    res.status(200).json({
        status: 'success',
        count: products.length,
        data: products
    });
});
//get product by id
export const getProductById = asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findOne({ _id: id, isActive: true })
        .populate('categoryId');

    if (!product) {
        return next(new CustomError('Product not found', 404));
    }

    res.status(200).json({
        status: 'success',
        data: product
    });
});
// Update product + Cloudinary Image Handling
export const updateProduct = asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params;
    const existingProduct = await Product.findById(id);

    if (!existingProduct || !existingProduct.isActive) {
        return next(new CustomError('Product not found', 404));
    }

    let updateData = { ...req.body };

    // Handle File Uploads (Replacing old images in Cloudinary)
    if (req.files) {
        // Handle Main Image replacement
        if (req.files["mainImage"]) {
            if (existingProduct.mainImage) await deleteFromCloudinary(existingProduct.mainImage);
            updateData.mainImage = req.files["mainImage"][0].path;
        }

        // Handle Additional Images replacement
        if (req.files["additionalImages"]) {
            if (existingProduct.additionalImages?.length > 0) {
                for (const img of existingProduct.additionalImages) {
                    await deleteFromCloudinary(img);
                }
            }
            updateData.additionalImages = req.files["additionalImages"].map(f => f.path);
        }
    }

    // Parse specifications if sent as a string 
    if (typeof req.body.specifications === 'string') {
        updateData.specifications = JSON.parse(req.body.specifications);
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        message: 'Product updated successfully',
        product: updatedProduct
    });
});
// Soft delete product + Cloudinary Cleanup
export const deleteProduct = asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
        return next(new CustomError('Product not found', 404));
    }

    // Cleanup images from Cloudinary to free up space
    if (product.mainImage) await deleteFromCloudinary(product.mainImage);
    if (product.additionalImages?.length > 0) {
        for (const img of product.additionalImages) {
            await deleteFromCloudinary(img);
        }
    }

    // Perform Soft Delete
    await Product.findByIdAndUpdate(id, { isActive: false });

    res.status(200).json({
        message: 'Product deleted successfully'
    });
});

/**
 * HELPER FUNCTIONS FOR CLOUDINARY
 */
const deleteFromCloudinary = async (url) => {
    const publicId = extractPublicId(url);
    if (publicId) {
        try {
            await cloudinary.uploader.destroy(publicId);
        } catch (error) {
            console.error("Cloudinary Deletion Error:", error);
        }
    }
};

const extractPublicId = (url) => {
    if (!url) return null;
    const parts = url.split('/');
    const uploadIndex = parts.indexOf('upload');
    if (uploadIndex === -1) return null;
    let startIndex = uploadIndex + 1;
    if (parts[startIndex].startsWith('v')) startIndex++; // skip version number
    const pathAfterUpload = parts.slice(startIndex).join('/');
    return pathAfterUpload.substring(0, pathAfterUpload.lastIndexOf('.'));
};