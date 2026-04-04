import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    categoryName: {
        type: String,
        required: [true, 'Category name is required'],
        trim: true,
        unique: true,
        index: true
    },
    description: {
        type: String,
        trim: true,
        default: ''
    },
    // image: {
    //     type: String,
    //     default: ''
    // },
    isActive: {
        type: Boolean,
        default: true,
        index: true
    },
    parentCategory: {   
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        default: null
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    order: {
        type: Number,
        default: 0
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
}
);


const Category = mongoose.model('Category', categorySchema);
export default Category;