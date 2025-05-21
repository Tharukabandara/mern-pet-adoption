import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createStoryAction } from "../../../redux/slices/stories/storySlice";
import { toast } from "react-toastify";
import LoadingComponent from "../../LoadingComp/LoadingComponent";
import { useNavigate } from "react-router-dom";

export default function CreateStory() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    phone: "",
  });
  const [files, setFiles] = useState([]);

  const { loading, isAdded, error } = useSelector((state) => state.stories);
  const { userInfo } = useSelector((state) => state.users.userAuth || {});

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

    if (!userInfo?.token) {
      toast.error("Please log in to post a story.");
      return;
    }

    const { title, description, location, phone } = formData;
    if (!title || !description || !location || !phone || files.length === 0) {
      toast.error("All fields and at least one image are required.");
      return;
    }

    dispatch(createStoryAction({ ...formData, files }));
  };

  useEffect(() => {
    if (isAdded) {
      toast.success("Story posted successfully!");
      navigate("/story-feed");
    }
    if (error) {
      toast.error(error?.message || "Failed to post story.");
    }
  }, [isAdded, error, navigate]);

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-center text-indigo-700">Post a Story</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="block w-full rounded-md border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Upload Image(s)</label>
          <input
            type="file"
            onChange={handleFileChange}
            multiple
            accept="image/*"
            className="mt-1 text-sm"
            required
          />
        </div>

        {/* Submit */}
        <div>
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md text-sm font-medium"
          >
            {loading ? <LoadingComponent /> : "Post Story"}
          </button>
        </div>
      </form>
    </div>
  );
}
