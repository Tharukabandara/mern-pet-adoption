import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createReviewAction } from "../../redux/slices/reviews/reviewSlice";
import { toast } from "react-toastify";

export default function ReviewForm({ productId, onReviewSubmit }) {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.reviews);
  const { profile } = useSelector((state) => state.users);
  const { product } = useSelector((state) => state.products.product || {});

  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [message, setMessage] = useState("");
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);

  // Check if the user already reviewed this product
  useEffect(() => {
    const userId = profile?.user?._id;
    const hasReviewed = product?.reviews?.some(
      (rev) => rev?.user?._id === userId || rev?.user === userId
    );
    setAlreadyReviewed(hasReviewed);
  }, [product?.reviews, profile?.user?._id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rating || !message.trim()) {
      toast.error("Please provide a rating and a comment.");
      return;
    }

    try {
      await dispatch(createReviewAction({ productID: productId, message, rating })).unwrap();
      toast.success("Review submitted successfully!");
      setRating(0);
      setHoveredRating(0);
      setMessage("");
      setAlreadyReviewed(true);
      if (typeof onReviewSubmit === "function") {
        onReviewSubmit(); // ✅ Refresh reviews
      }
    } catch (err) {
      if (typeof err === "string") toast.error(err);
      else if (err?.message) toast.error(err.message);
      else toast.error("Failed to submit review.");
    }
  };

  if (alreadyReviewed) {
    return (
      <div className="p-4 bg-yellow-100 text-yellow-800 border border-yellow-300 rounded">
        You already submitted a review for this product.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Star Rating */}
      <div>
        <label className="block font-medium mb-1">Your Rating</label>
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              type="button"
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="text-3xl focus:outline-none"
            >
              <span className={`${(hoveredRating || rating) >= star ? "text-yellow-400" : "text-gray-300"}`}>
                ★
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Message Box */}
      <div>
        <label className="block font-medium mb-1">Your Review</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          placeholder="Write your thoughts here..."
          className="w-full border border-gray-300 rounded-md p-2"
          required
        />
      </div>

      {/* Submit */}
      <div>
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Review"}
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </form>
  );
}
