import Category from '../models/categoryModel.js'; 

export const createCategory = async (req, res) => {
  try {
    const {
      categoryIcon,
      categoryName,
      status,
      subcategories
      
    } = req.body;

    // Validate required fields
    if (!categoryIcon || !categoryName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create a new category instance
    const newCategory = new Category({
      categoryIcon,
      categoryName,
      subcategories: subcategories || [],
      status: status || 'active', 
      doctors:[] , 
      hospitals:[]
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