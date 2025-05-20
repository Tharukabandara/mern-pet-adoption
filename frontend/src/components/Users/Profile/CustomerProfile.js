import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfileAction } from "../../../redux/slices/users/usersSlice";
import CustomerDetails from "./CustomerDetails";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/20/solid";

export default function CustomerProfile() {
  const dispatch = useDispatch();
  const { profile, loading, error } = useSelector((state) => state.users);
  const [sortNewestFirst, setSortNewestFirst] = useState(true);

  const hasFetchedProfile = !!profile?.user?._id;

  useEffect(() => {
    if (!hasFetchedProfile) {
      dispatch(getUserProfileAction());
    }
  }, [dispatch, hasFetchedProfile]);

  const user = profile?.user;
  const orders = [...(user?.orders || [])].sort((a, b) => {
    return sortNewestFirst
      ? new Date(b.createdAt) - new Date(a.createdAt)
      : new Date(a.createdAt) - new Date(b.createdAt);
  });

  return (
    <div className="bg-gray-100 min-h-screen py-10 px-4">
      {loading ? (
        <h2 className="text-center text-lg">Loading...</h2>
      ) : error ? (
        <h2 className="text-center text-red-500">{error.message || "Something went wrong"}</h2>
      ) : !user ? (
        <h2 className="text-center">Loading profile...</h2>
      ) : (
        <>
          <div className="flex justify-center mb-10">
            <div className="w-full max-w-3xl">
              <CustomerDetails
                email={user.email}
                dateJoined={new Date(user.createdAt).toDateString()}
                fullName={user.fullname}
              />
            </div>
          </div>

          <div className="max-w-5xl mx-auto bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Your Orders</h2>
              <div>
                <label className="mr-2 text-sm text-gray-600">Sort:</label>
                <select
                  value={sortNewestFirst ? "newest" : "oldest"}
                  onChange={(e) => setSortNewestFirst(e.target.value === "newest")}
                  className="border rounded px-2 py-1 text-sm"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>
            </div>

            {orders.length === 0 ? (
              <h2 className="text-center mt-10 text-gray-500">No Order Found</h2>
            ) : (
              <div className="space-y-8 divide-y divide-gray-200">
                {orders.map((order) => (
                  <div key={order._id || order.orderNumber} className="pt-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-gray-800 font-medium">Order #{order?.orderNumber}</p>
                        <p className="text-sm text-gray-500">
                          Placed on {new Date(order?.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Status: <span className="font-semibold">{order?.status}</span></p>
                        <p className="text-sm text-gray-600">Payment: <span className="font-semibold">{order?.paymentMethod}</span></p>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                      {order?.orderItems?.map((product) => (
                        <div
                          key={product._id || product.id}
                          className="flex items-start gap-4 bg-gray-50 p-4 rounded shadow-sm"
                        >
                          <img
                            src={product.images?.[0] || "/placeholder.png"}
                            alt={product.name}
                            className="w-24 h-24 object-cover rounded"
                          />
                          <div>
                            <h3 className="text-base font-medium text-gray-900">{product.name}</h3>
                            <p className="text-sm text-gray-500 mt-1">{product.description}</p>
                            <p className="text-sm font-semibold text-gray-800 mt-2">Rs.{product.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 text-sm text-gray-600 flex items-center">
                      {order.paymentStatus === "paid" ? (
                        <>
                          <CheckCircleIcon className="h-5 w-5 text-green-600 mr-1" />
                          <span className="text-green-600 font-semibold">Paid</span>
                        </>
                      ) : (
                        <>
                          <XCircleIcon className="h-5 w-5 text-red-500 mr-1" />
                          <span className="text-red-500 font-semibold">Not Paid</span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
