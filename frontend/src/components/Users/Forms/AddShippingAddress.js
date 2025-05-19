import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateShippingAddressAction } from "../../../redux/slices/users/usersSlice";
import { toast } from "react-toastify";

export default function AddShippingAddress() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.users?.profile?.user);
  const savedAddress = user?.shippingAddress || {};

  const [form, setForm] = useState({
    firstName: savedAddress.firstName || "",
    lastName: savedAddress.lastName || "",
    address: savedAddress.address || "",
    city: savedAddress.city || "",
    postalCode: savedAddress.postalCode || "",
    province: savedAddress.province || "",
    phone: savedAddress.phone || "",
    country: savedAddress.country || "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const emptyFields = Object.entries(form).filter(([_, v]) => !v);
    if (emptyFields.length > 0) {
      toast.error("All fields are required");
      return;
    }

    dispatch(updateShippingAddressAction(form))
      .unwrap()
      .then(() => toast.success("Shipping address saved"))
      .catch((err) => toast.error(err?.message || "Failed to save address"));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {Object.keys(form).map((field) => (
        <div key={field}>
          <label className="block text-sm font-medium text-gray-700 capitalize">{field}</label>
          <input
            type="text"
            name={field}
            value={form[field]}
            onChange={handleChange}
            className="mt-1 block w-full border px-3 py-2 rounded-md"
            required
          />
        </div>
      ))}
      <button
        type="submit"
        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 w-full"
      >
        Save Address
      </button>
    </form>
  );
}
