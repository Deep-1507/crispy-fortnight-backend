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

export const getCategoriesHome = async (req, res) => {
  try {
    // Fetch 6 categories where parentCategoryId is null
    const categories = await Category.find({ parentCategoryId: null })
      .select('categoryIcon categoryName') // Select only the icon and name
      .limit(6); // Limit to 6 results

    res.status(200).json(categories); 
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCategoriesParent = async (req, res) => {
  try {
    // Fetch 6 categories where parentCategoryId is null
    const categories = await Category.find({ parentCategoryId: null })
      .select('categoryName') // Select only the icon and name
    res.status(200).json(categories); 
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const searchCategories = async (req, res) => {
  try {
    // Extract query parameters
    const { categoryName, subCategoryName, status } = req.query;

    // Build the query object for status
    let query = {};
    if (status) {
      query.status = status;
    }

    // If both parentCategory and subCategory are mentioned in the query
    if (categoryName && subCategoryName) {
      // Find the parent category
      const parentCategory = await Category.findOne({ categoryName: new RegExp(categoryName, 'i'), ...query }).select('-createdAt -updatedAt');

      if (!parentCategory) {
        return res.status(404).json({ message: `Parent Category "${categoryName}" not found` });
      }

      // Find the subcategory within that parent category
      const subCategory = await Category.findOne({ categoryName: new RegExp(subCategoryName, 'i'), parentCategoryId: parentCategory._id, ...query }).select('-createdAt -updatedAt');

      if (!subCategory) {
        return res.status(404).json({ message: `Subcategory "${subCategoryName}" not found under Parent Category "${categoryName}"` });
      }

      // Return both the parent category and the specific subcategory
      return res.status(200).json({ parentCategory, subCategory });
    }

    // If only parentCategory is mentioned, return parent and its subcategories
    if (categoryName) {
      const parentCategory = await Category.findOne({ categoryName: new RegExp(categoryName, 'i'), ...query }).select('-createdAt -updatedAt');

      if (!parentCategory) {
        return res.status(404).json({ message: `Category "${categoryName}" not found` });
      }

      const subcategories = await Category.find({ parentCategoryId: parentCategory._id, ...query }).select('-createdAt -updatedAt');
      return res.status(200).json({ parentCategory, subcategories });
    }

    // If no categoryName is provided, return all parent categories
    const parentCategories = await Category.find({ parentCategoryId: null, ...query }).select('-createdAt -updatedAt');
    return res.status(200).json(parentCategories);
    
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Error fetching categories', error: error.message });
  }
};




// If both categoryName (parent category) and subCategoryName are present in the query, it finds the parent category and then finds the subcategory within it.
// Returns both the parent category and the matching subcategory.
// If only categoryName (parent category) is provided, it returns the parent category and all its subcategories.