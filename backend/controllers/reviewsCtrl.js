import asyncHandler from "express-async-handler";
import Product from "../model/Product.js";
import Review from "../model/Review.js";
import Order from "../model/Order.js";

// @desc    Create new review
// @route   POST /api/v1/reviews/:productID
// @access  Private
export const createReviewCtrl = asyncHandler(async (req, res) => {
  const { message, rating } = req.body;
  const { productID } = req.params;

  // 1. Find the product
  const product = await Product.findById(productID).populate("reviews");
  if (!product) throw new Error("Product Not Found");

  // 2. Check if user has already reviewed this product
  const alreadyReviewed = product.reviews.find(
    (review) => review?.user?.toString() === req.userAuthId.toString()
  );
  if (alreadyReviewed) throw new Error("You have already reviewed this product");

  // 3. Check if user has ordered this product
  const orders = await Order.find({ user: req.userAuthId });
  const hasOrdered = orders.some((order) =>
    order.orderItems.some((item) => item._id?.toString() === productID)
  );
  if (!hasOrdered) throw new Error("You can only review products you have purchased");

  // 4. Create review
  const review = await Review.create({
    message,
    rating,
    product: product._id,
    user: req.userAuthId,
  });

  // 5. Push review into product & recalculate ratings
  product.reviews.push(review._id);

  // Recalculate average rating
  const allReviews = await Review.find({ product: product._id });
  const averageRating =
    allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

  product.numReviews = allReviews.length;
  product.averageRating = averageRating;

  await product.save();

  res.status(201).json({
    success: true,
    message: "Review created successfully",
  });
});

// @desc    Delete a review
// @route   DELETE /api/v1/reviews/:id
// @access  Private
export const deleteReviewCtrl = asyncHandler(async (req, res) => {
  const reviewId = req.params.id;

  const review = await Review.findById(reviewId);
  if (!review) throw new Error("Review not found");

  if (review.user.toString() !== req.userAuthId.toString()) {
    res.status(403);
    throw new Error("You are not authorized to delete this review");
  }

  // Delete the review
  await review.deleteOne();

  // Remove it from product
  await Product.findByIdAndUpdate(review.product, {
    $pull: { reviews: review._id },
  });

  // Recalculate rating
  const remainingReviews = await Review.find({ product: review.product });
  const averageRating = remainingReviews.length
    ? remainingReviews.reduce((sum, r) => sum + r.rating, 0) / remainingReviews.length
    : 0;

  await Product.findByIdAndUpdate(review.product, {
    numReviews: remainingReviews.length,
    averageRating,
  });

  res.json({ success: true, message: "Review deleted successfully" });
});
