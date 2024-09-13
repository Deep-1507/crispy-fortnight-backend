import Category from '../models/categoryModel.js'; 

export const createCategory = async (req, res) => {
  try {
    const {
      categoryIcon,
      categoryName,
      status,
      parentCategoryName // Parent category name is passed in the request body
    } = req.body;

    // Validate required fields
    if (!categoryIcon || !categoryName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Initialize parentCategoryId as null
    let parentCategoryId = null;

    // If parentCategoryName is provided, search for its ObjectId
    if (parentCategoryName) {
      const parentCategory = await Category.findOne({ categoryName: parentCategoryName });

      if (!parentCategory) {
        return res.status(400).json({ error: `Parent category with name '${parentCategoryName}' not found` });
      }

      // Assign parent category's ObjectId to parentCategoryId
      parentCategoryId = parentCategory._id;
    }

    // Create a new category instance
    const newCategory = new Category({
      categoryIcon,
      categoryName,
      parentCategoryId, // Set parentCategoryId to the found category's ObjectId or null
      status: status || 'active',
      doctors: [],
      hospitals: []
    });

    const savedCategory = await newCategory.save();

    res.status(201).json({ category: savedCategory });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ error: 'Server error' });
  }
};



export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({}, 'categoryName'); // Fetch only category names
    res.status(200).json(categories); // Send the list of categories as a response
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



export const searchCategories = async (req, res) => {
  try {
    // Extract category name from query
    const { categoryName } = req.query;

    // If no categoryName is provided, return all parent categories (those with parentCategoryId: null)
    if (!categoryName) {
      const parentCategories = await Category.find({ parentCategoryId: null });
      return res.status(200).json(parentCategories);
    }

    // If a categoryName is provided, find the category and its subcategories
    const parentCategory = await Category.findOne({ categoryName: new RegExp(categoryName, 'i') });

    if (!parentCategory) {
      return res.status(404).json({ message: `Category "${categoryName}" not found` });
    }

    // Fetch subcategories based on parentCategoryId
    const subcategories = await Category.find({ parentCategoryId: parentCategory._id });

    // Return the parent category and its subcategories
    res.status(200).json({ parentCategory, subcategories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Error fetching categories', error: error.message });
  }
};