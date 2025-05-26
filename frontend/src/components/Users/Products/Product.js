import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchProductAction } from "../../../redux/slices/products/productSlices";
import { addToCart } from "../../../redux/slices/cart/cartSlice";
import { getUserProfileAction } from "../../../redux/slices/users/usersSlice";
import ReviewForm from "../../Reviews/ReviewForm";
import { toast } from "react-toastify";
import baseURL from "../../../utils/baseURL";
import "react-toastify/dist/ReactToastify.css";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Product() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    dispatch(fetchProductAction(id));
    dispatch(getUserProfileAction());
  }, [dispatch, id]);

  const { loading, error, product: { product } = {} } = useSelector((state) => state?.products);
  const { cartItems } = useSelector((state) => state?.cart);
  const { userAuth, profile } = useSelector((state) => state.users);

  const inStock = product?.totalQty > 0;

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty: 1 }));
    toast.success("Product added to cart!");
  };

  const handleCheckout = () => {
    if (!userAuth?.userInfo?.token) {
      toast.warn("Please login to proceed to checkout.");
      navigate("/login");
    } else {
      navigate("/order-payment");
    }
  };

  const hasPurchased = profile?.user?.orders?.some(order =>
    order?.orderItems?.some(item => item?._id === product?._id)
  );

  const goToNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const goToPreviousImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      const token = userAuth?.userInfo?.token;
      await fetch(`${baseURL}/reviews/${reviewId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Review deleted");
      dispatch(fetchProductAction(product._id));
    } catch (err) {
      toast.error("Failed to delete review");
    }
  };

  return (
    <div className="bg-white">
      <main className="mx-auto mt-8 max-w-2xl px-4 pb-16 sm:px-6 sm:pb-24 lg:max-w-7xl lg:px-8">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error?.message}</p>
        ) : (
          <div className="lg:grid lg:auto-rows-min lg:grid-cols-12 lg:gap-x-8">
            <div className="lg:col-span-5 lg:col-start-8">
              <div className="flex justify-between">
                <h1 className="text-xl font-medium text-gray-900">{product?.name}</h1>
                <p className="text-xl font-medium text-gray-900">Rs. {product?.price}.00</p>
              </div>
              <p className={`mt-2 text-sm font-medium ${inStock ? "text-green-600" : "text-red-600"}`}>
                {inStock ? `In Stock (${product.qtyLeft} available)` : "Out of Stock"}
              </p>
            </div>

            {/* Image Carousel */}
            <div className="mt-8 lg:col-span-7 lg:col-start-1 lg:row-span-3 lg:row-start-1 flex flex-col items-center">
              <div className="relative w-full max-w-md mx-auto flex items-center justify-center">
                <button
                  onClick={goToPreviousImage}
                  className="absolute left-0 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-l"
                >
                  &#8592;
                </button>

                <img
                  src={product?.images[currentImageIndex]}
                  alt={`Product ${currentImageIndex + 1}`}
                  className="rounded-lg object-contain max-h-[400px] w-full"
                />

                <button
                  onClick={goToNextImage}
                  className="absolute right-0 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-r"
                >
                  &#8594;
                </button>
              </div>

              <div className="mt-4 flex space-x-2">
                {product?.images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    className={`h-14 w-14 rounded border cursor-pointer ${index === currentImageIndex ? "border-indigo-500" : "border-gray-300"}`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            </div>

            {/* Add to cart + description */}
            <div className="mt-8 lg:col-span-5">
              {inStock && (
                <button
                  onClick={addToCartHandler}
                  className="mt-8 flex w-full items-center justify-center rounded-md border border-transparent bg-[#7f6363] hover:bg-[#6e5656] py-3 px-8 text-base font-medium text-white"
                >
                  Add to cart
                </button>
              )}

              {inStock &&
                cartItems?.find((item) => item._id === product?._id) && (
                  <button
                    onClick={handleCheckout}
                    className="mt-4 flex w-full items-center justify-center rounded-md border border-transparent bg-green-700 hover:bg-green-600 py-3 px-8 text-base font-medium text-white "
                  >
                    Proceed to Checkout
                  </button>
                )}

              <div className="mt-10">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">Description</h2>
                <p className="text-sm text-gray-700 whitespace-pre-wrap break-words leading-relaxed text-justify border border-white rounded-md p-4 ">{product?.description}</p>
              </div>
            </div>

            {/* Reviews */}
            <div className="mt-10 lg:col-span-12">
              <h2 className="text-lg font-semibold mb-2">Reviews</h2>
              {product?.reviews?.length > 0 ? (
                product.reviews.map((review, idx) => {
                  const isMyReview =
                    review?.user?._id === profile?.user?._id ||
                    review?.user === profile?.user?._id;
                  return (
                    <div key={idx} className="border p-3 mb-2 rounded-md bg-gray-50 relative">
                      {isMyReview && (
                        <div className="absolute top-2 right-2">
                          <IconButton
                            aria-label="delete"
                            size="large"
                            onClick={() => {
                              const confirmed = window.confirm("Are you sure you want to delete your review?");
                              if (confirmed) handleDeleteReview(review._id);
                            }}
                            className="text-red-500 hover:text-red-700 transition transform duration-200 hover:scale-110"
                          >
                            <DeleteIcon fontSize="medium" />
                          </IconButton>
                        </div>
                      )}
                      <p className="font-semibold pr-10">Rating: {review.rating} ⭐</p>
                      <p className="text-sm text-gray-600">By: {review?.user?.fullname || "Anonymous"}</p>
                      <p>{review.message}</p>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500">No reviews yet.</p>
              )}
              {userAuth?.userInfo?.token && hasPurchased && (
                <div className="mt-6">
                  <h3 className="text-md font-semibold mb-2">Leave a Review</h3>
                  <ReviewForm productId={product._id} onReviewSubmit={() => dispatch(fetchProductAction(product._id))} />
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
