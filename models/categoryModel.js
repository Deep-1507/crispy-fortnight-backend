import mongoose, { model } from 'mongoose';
const { Schema } = mongoose;

// Define the Category schema
const categorySchema = new Schema({
  categoryIcon: {
    type: String,
    required: true, // URL for the category icon
  },
  categoryName: {
    type: String,
    required: true, // Name of the category
  },
  createdAt: {
    type: Date,
    default: Date.now, // Timestamp when the category was created
  },
  parentCategoryId: {
    type: Schema.Types.ObjectId,
    ref: 'Category', // Reference to another Category document, if this is a subcategory
    default: null, // No parent category by default
  },
  status: {
    type: String,
    enum: ['active', 'inactive'], // Status of the category
    default: 'active', // Default status
  },
  subcategories: [{
    type: String,
    default: [], // Default to an empty array
  }],
  updatedAt: {
    type: Date,
    default: Date.now, // Timestamp when the category was last updated
  },
  doctors: [{
    type: Schema.Types.ObjectId,
    ref: 'Doctor', // Reference to Doctor documents associated with this category
    default: [], // Default to an empty array
  }],
  hospitals: [{
    type: Schema.Types.ObjectId,
    ref: 'Hospital', // Reference to Hospital documents associated with this category
    default: [], // Default to an empty array
  }],
});

// Create a model from the schema
const Category = model('Category', categorySchema);

export default Category;
