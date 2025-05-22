import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMyStoriesAction,
  deleteStoryAction,
} from "../../../redux/slices/stories/storySlice";
import { formatDistanceToNow } from "date-fns";
import { toast } from "react-toastify";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

export default function MyStories() {
  const dispatch = useDispatch();
  const { myStories, loading, error } = useSelector((state) => state.stories);
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [expandedStoryIds, setExpandedStoryIds] = useState([]);
  const [sortOrder, setSortOrder] = useState("desc"); // default to newest first

  useEffect(() => {
    dispatch(fetchMyStoriesAction());
  }, [dispatch]);

  const sortedStories = [...myStories]?.sort((a, b) =>
    sortOrder === "asc"
      ? new Date(a.createdAt) - new Date(b.createdAt)
      : new Date(b.createdAt) - new Date(a.createdAt)
  );

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this story?")) {
      dispatch(deleteStoryAction(id))
        .unwrap()
        .then(() => {
          toast.success("Story deleted successfully");
          dispatch(fetchMyStoriesAction());
        })
        .catch((err) => {
          toast.error(err?.message || "Failed to delete story");
        });
    }
  };

  const handleNextImage = (storyId, length) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [storyId]: (prev[storyId] + 1 || 1) % length,
    }));
  };

  const handlePrevImage = (storyId, length) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [storyId]: (prev[storyId] - 1 + length || length - 1) % length,
    }));
  };

  const toggleDescription = (id) => {
    setExpandedStoryIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-3xl font-bold text-gray-800">My Stories</h2>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-indigo-500"
        >
          <option value="desc">Newest to Oldest</option>
          <option value="asc">Oldest to Newest</option>
        </select>
      </div>

      {loading ? (
        <p className="text-center text-gray-600">Loading your stories...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error.message}</p>
      ) : sortedStories?.length === 0 ? (
        <p className="text-center text-gray-600">You haven't posted any stories yet.</p>
      ) : (
        <div className="space-y-10">
          {sortedStories.map((story) => {
            const imageIndex = currentImageIndex[story._id] || 0;
            const isExpanded = expandedStoryIds.includes(story._id);
            const shortDesc = story.description.slice(0, 250);

            return (
              <div
                key={story._id}
                className="bg-white rounded-lg shadow-lg hover:shadow-xl transition overflow-hidden"
              >
                {/* Image Carousel */}
                {story.images?.length > 0 && (
                  <div className="relative w-full h-80">
                    <img
                      src={story.images[imageIndex]}
                      alt={`Story ${imageIndex}`}
                      className="w-full h-80 object-cover"
                    />
                    {story.images.length > 1 && (
                      <>
                        <button
                          onClick={() => handlePrevImage(story._id, story.images.length)}
                          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white bg-opacity-80 p-2 rounded-full shadow hover:bg-opacity-100"
                        >
                          <ChevronLeftIcon className="h-6 w-6 text-gray-800" />
                        </button>
                        <button
                          onClick={() => handleNextImage(story._id, story.images.length)}
                          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white bg-opacity-80 p-2 rounded-full shadow hover:bg-opacity-100"
                        >
                          <ChevronRightIcon className="h-6 w-6 text-gray-800" />
                        </button>
                      </>
                    )}
                  </div>
                )}

                {/* Text Content */}
                <div className="p-6 space-y-4">
                  <h3 className="text-2xl font-bold text-indigo-700">{story.title}</h3>

                  <p className="text-gray-700 text-sm whitespace-pre-wrap break-words leading-relaxed">
                    {isExpanded ? story.description : `${shortDesc}...`}
                  </p>

                  {story.description.length > 250 && (
                    <button
                      onClick={() => toggleDescription(story._id)}
                      className="text-sm text-indigo-600 hover:underline"
                    >
                      {isExpanded ? "Show less" : "Read more"}
                    </button>
                  )}

                  <div className="text-sm text-gray-600">
                    <strong>Location:</strong> {story.location}
                  </div>
                  <div className="text-sm text-gray-600">
                    <strong>Phone:</strong> {story.phone}
                  </div>

                  <div className="flex justify-between items-center text-xs text-gray-500 mt-2">
                    <span>
                      Posted • {formatDistanceToNow(new Date(story.createdAt), { addSuffix: true })}
                    </span>

                    <button
                      onClick={() => handleDelete(story._id)}
                      className="text-sm text-red-600 hover:text-red-800 font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
