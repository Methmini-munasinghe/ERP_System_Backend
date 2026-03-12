import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
        index: true
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    item_count: {
        type: Number,
        default: 0
    },
    description: {
        type: String,
        trim: true
    },
    weight: {
        type: Number,
        default: 0
    },
    color: {
        type: String,
        default: 'N/A'
    },
    size: {
        type: String,
        default: 'N/A'
    },
    isActive: {
        type: Boolean,
        default: true,
        index: true
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Category ID is required'],
        index: true
    },
    mainImage: {
        type: String,
        required: [true, 'Main image URL is required']
    },
    additionalImages: {
        type: [String],
        default: []
    },
    sellType: {
        type: String,
        default: 'ex'
    },
    categoryType: {
        type: String,
        default: 'other'
    },
    specifications: {
        type: Object,
        default: {}
    },
    tags: {
        type: [String],
        default: []
    },
    rating: {
        type: Number,
        default: 0
    },
    reviewCount: {
        type: Number,
        default: 0
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    discountPercentage: {
        type: Number,
        default: 0
    },
    sku: {
        type: String,
        unique: true,
        required: [true, 'SKU is required'],
        index: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for hasDiscount
productSchema.virtual('hasDiscount').get(function() {
    return this.discountPercentage > 0;
});

const Product = mongoose.model('Product', productSchema);
export default Product;