import asyncHandler from "express-async-handler";
import Category from "../model/Category.js";

// @desc    Create new category
// @route   POST /api/v1/categories
// @access  Private/Admin
export const createCategoryCtrl = asyncHandler(async (req, res) => {
  const { name } = req.body;

  // Check if category already exists
  const categoryFound = await Category.findOne({ name: name?.toLowerCase() });
  if (categoryFound) {
    throw new Error("Category already exists");
  }

  // Check if image is uploaded
  if (!req.file) {
    throw new Error("Image file is required");
  }

  // Create new category
  const category = await Category.create({
    name: name?.toLowerCase(),
    user: req.userAuthId,
    image: req.file.path, // safe to access now
  });

  res.status(201).json({
    status: "success",
    message: "Category created successfully",
    category,
  });
});

// @desc    Get all categories
// @route   GET /api/v1/categories
// @access  Public
export const getAllCategoriesCtrl = asyncHandler(async (req, res) => {
  const categories = await Category.find().populate("products");
  res.json({
    status: "success",
    message: "Fetched categories successfully",
    categories,
  });
});

// @desc    Get single category
// @route   GET /api/v1/categories/:id
// @access  Public
export const getSingleCategoryCtrl = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id).populate("products");
  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  res.json({
    status: "success",
    message: "Fetched category successfully",
    category,
  });
});

// @desc    Update category
// @route   PUT /api/v1/categories/:id
// @access  Private/Admin
export const updateCategoryCtrl = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const category = await Category.findByIdAndUpdate(
    req.params.id,
    { name: name?.toLowerCase() },
    { new: true }
  );

  if (!category) {
    res.status(404);
    throw new Error("Category not found for update");
  }

  res.json({
    status: "success",
    message: "Category updated successfully",
    category,
  });
});

// @desc    Delete category
// @route   DELETE /api/v1/categories/:id
// @access  Private/Admin
export const deleteCategoryCtrl = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error("Category not found for deletion");
  }

  res.json({
    status: "success",
    message: "Category deleted successfully",
    category,
  });
});
