import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPetAdAction } from "../../redux/slices/petAds/petAdSlices";
import { fetchPetCategoriesAction } from "../../redux/slices/categories/petCategoriesSlice";
import LoadingComponent from "../LoadingComp/LoadingComponent";
import { toast } from "react-toastify";

export default function CreatePetAd() {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    petCategory: "",
    location: "",
    phone: "",
    price: "",
  });
  const [isFree, setIsFree] = useState(false);
  const [files, setFiles] = useState([]);

  const petCategories = useSelector((state) => state.petCategories);
  const { loading, error, isAdded } = useSelector((state) => state.petAds);

  useEffect(() => {
    dispatch(fetchPetCategoriesAction());
  }, [dispatch]);

  useEffect(() => {
    if (isAdded) {
      toast.success("Pet Ad created successfully!");
    }
    if (error) {
      toast.error(error?.message || "Failed to create ad");
    }
  }, [isAdded, error]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSubmit = {
      ...formData,
      price: isFree ? 0 : formData.price,
      files,
    };
    dispatch(createPetAdAction(dataToSubmit));
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-8 rounded shadow">
      <h2 className="text-2xl text-[#7f6363] font-bold mb-4 text-center">Post a Pet Ad</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title, Location, Phone */}
        {[
          { label: "Title", name: "title" },
          { label: "Location", name: "location" },
          { label: "Phone", name: "phone" },
        ].map(({ label, name }) => (
          <div key={name}>
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <input
              type="text"
              name={name}
              value={formData[name]}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        ))}

        {/* Free Checkbox */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="free"
            checked={isFree}
            onChange={() => setIsFree(!isFree)}
            className="mr-2"
          />
          <label htmlFor="free" className="text-sm text-gray-700">
            This pet is free
          </label>
        </div>

        {/* Price Field (conditional) */}
        {!isFree && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        )}

        {/* Pet Category Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Pet Category</label>
          <select
            name="petCategory"
            value={formData.petCategory}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
            <option value="">-- Select Pet Category --</option>
            {petCategories?.petCategories?.map((cat) => (
              <option key={cat._id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            required
            className="block w-full rounded-md border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Upload Images</label>
          <input
            type="file"
            onChange={handleFileChange}
            multiple
            accept="image/*"
            className="mt-1 text-sm"
          />
        </div>

        {/* Submit */}
        <div>
          <button
            type="submit"
            className="w-full bg-[#7f6363] hover:bg-[#6e5656] text-white py-2 rounded text-sm font-medium">
            {loading ? <LoadingComponent /> : "Post Ad"}
          </button>
        </div>
      </form>
    </div>
  );
}
