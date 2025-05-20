import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfileAction } from "../../../redux/slices/users/usersSlice";
import ShippingAddressDetails from "./ShippingAddressDetails";
import AddShippingAddress from "../Forms/AddShippingAddress";

export default function ShippingAddress() {
  const dispatch = useDispatch();
  const { profile, loading } = useSelector((state) => state.users);
  const user = profile?.user;
  const shippingAddress = user?.shippingAddress;
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    dispatch(getUserProfileAction());
  }, [dispatch]);

  return (
    <div className="bg-gradient-to-r from-indigo-50 to-blue-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Shipping Address
        </h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : !shippingAddress || isEditing ? (
          <div>
            {!shippingAddress && (
              <p className="text-sm text-gray-600 mb-4 text-center">
                No shipping address found. Please add your shipping details below.
              </p>
            )}
            <AddShippingAddress />
          </div>
        ) : (
          <>
            <ShippingAddressDetails />
            <div className="mt-6 text-center">
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Update Shipping Address
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
