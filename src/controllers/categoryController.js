import Category from "../models/Category.js";


export function getAllCategories  (req, res){
        Category.find({ isActive: true }).then(
        (categories)=>{
            res.json(categories);
        }
       )
     }

export function getCategoryById(req, res) {
     const { id } = req.params;
     Category.findOne({ _id: id, isActive: true }).then(
          (category) => {
               if (!category) {
                    return res.status(404).json({message: 'Category not found'});
               }
               res.json(category);
          }
     ).catch(
          (err) => {
               res.status(500).json({message: 'Error retrieving category', error: err.message});
          }
     );
}

export function createCategory(req, res) {
     const category = new Category(req.body);
        category.save().then(
            ()=>{
                res.json({message: 'Category created successfully', category});
            }
        )
}

export function deleteCategory(req, res) {
     const { id } = req.params;
     Category.findByIdAndUpdate(id, { isActive: false }, { new: true }).then(
          (category) => {
               if (!category) {
                    return res.status(404).json({message: 'Category not found'});
               }
               res.json({message: 'Category deleted successfully', category});
          }
     ).catch(
          (err) => {
               res.status(500).json({message: 'Error deleting category', error: err.message});
          }
     );
}

export function updateCategory(req, res) {
     const { id } = req.params;
     Category.findByIdAndUpdate(id, req.body, { new: true, runValidators: true }).then(
          (category) => {
               if (!category || !category.isActive) {
                    return res.status(404).json({message: 'Category not found'});
               }
               res.json({message: 'Category updated successfully', category});
          }
     ).catch(
          (err) => {
               res.status(500).json({message: 'Error updating category', error: err.message});
          }
     );
}

