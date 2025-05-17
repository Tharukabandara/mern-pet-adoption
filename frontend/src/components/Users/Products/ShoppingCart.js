import { useDispatch, useSelector } from "react-redux";
import {
  removeFromCart,
  updateQuantity,
  clearCart,
} from "../../../redux/slices/cart/cartSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

export default function ShoppingCart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { cartItems } = useSelector((state) => state.cart);
  const { userAuth } = useSelector((state) => state.users);

  const changeOrderItemQtyHandler = (id, qty) => {
    dispatch(updateQuantity({ id, qty: Number(qty) }));
  };

  const removeOrderItemFromLocalStorageHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleCheckout = () => {
    if (!userAuth?.userInfo?.token) {
      toast.warn("Please login to proceed to checkout.");
      navigate("/login", { state: { from: "/shopping-cart" } });
    } else {
      navigate("/order-payment");
    }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 pt-16 pb-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Shopping Cart
        </h1>
        <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <section aria-labelledby="cart-heading" className="lg:col-span-7">
            <h2 id="cart-heading" className="sr-only">Items in your shopping cart</h2>

            {cartItems.length === 0 ? (
              <p className="text-gray-600">Your cart is empty.</p>
            ) : (
              <ul className="divide-y divide-gray-200 border-t border-b border-gray-200">
                {cartItems.map((product) => (
                  <li key={product._id} className="flex py-6 sm:py-10">
                    <div className="flex-shrink-0">
                      <img
                        src={product.images?.[0]}
                        alt={product.title}
                        className="h-24 w-24 rounded-md object-cover object-center sm:h-48 sm:w-48"
                      />
                    </div>
                    <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                      <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                        <div>
                          <div className="flex justify-between">
                            <h3 className="text-sm font-medium text-gray-700">
                              {product.title}
                            </h3>
                          </div>
                          <p className="mt-1 text-sm text-gray-500">
                            Rs. {product.price}
                          </p>
                        </div>

                        <div className="mt-4 sm:mt-0 sm:pr-9">
                          <label className="sr-only">Quantity</label>
                          <select
                            onChange={(e) =>
                              changeOrderItemQtyHandler(product._id, e.target.value)
                            }
                            value={product.qty}
                            className="max-w-full rounded-md border border-gray-300 py-1.5 text-left text-base font-medium text-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                          >
                            {[...Array(10).keys()].map((x) => (
                              <option key={x + 1} value={x + 1}>
                                {x + 1}
                              </option>
                            ))}
                          </select>
                          <div className="absolute top-0 right-0">
                            <button
                              onClick={() => removeOrderItemFromLocalStorageHandler(product._id)}
                              className="-m-2 inline-flex p-2 text-gray-400 hover:text-gray-500"
                            >
                              <span className="sr-only">Remove</span>
                              <svg
                                className="h-5 w-5"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Order Summary */}
          <section className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
            <h2 className="text-lg font-medium text-gray-900">Order summary</h2>
            <dl className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <dt className="text-sm text-gray-600">Subtotal</dt>
                <dd className="text-sm font-medium text-gray-900">
                  Rs. {subtotal.toFixed(2)}
                </dd>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <dt className="text-base font-medium text-gray-900">Order total</dt>
                <dd className="text-base font-medium text-gray-900">
                  Rs. {subtotal.toFixed(2)}
                </dd>
              </div>
            </dl>

            <div className="mt-6">
              <button
                onClick={handleCheckout}
                className="w-full inline-block rounded-md border border-transparent bg-indigo-600 py-3 px-4 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Proceed to Checkout
              </button>
            </div>

            {cartItems.length > 0 && (
              <div className="mt-4 text-right">
                <button
                  onClick={() => dispatch(clearCart())}
                  className="text-sm text-red-600 hover:underline"
                >
                  Clear Cart
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
