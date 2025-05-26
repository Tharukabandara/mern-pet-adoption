import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllStoriesAction,
  deleteStoryAction,
} from "../../../redux/slices/stories/storySlice";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { toast } from "react-toastify";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

export default function StoryFeed() {
  const dispatch = useDispatch();
  const { stories, loading, error } = useSelector((state) => state.stories);
  const { userInfo } = useSelector((state) => state.users.userAuth || {});
  const [page, setPage] = useState(1);
  const itemsPerPage = 3;
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [expandedStoryIds, setExpandedStoryIds] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchAllStoriesAction());
  }, [dispatch]);

  const sortedStories = [...stories]?.sort((a, b) => {
    return sortOrder === "asc"
      ? new Date(a.createdAt) - new Date(b.createdAt)
      : new Date(b.createdAt) - new Date(a.createdAt);
  });

  const paginatedStories = sortedStories?.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(sortedStories?.length / itemsPerPage);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this story?")) {
      dispatch(deleteStoryAction(id))
        .unwrap()
        .then(() => {
          toast.success("Story deleted successfully");
          dispatch(fetchAllStoriesAction());
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
    <div className="bg-[#ede4dd] min-h-screen py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header and Filters */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <h2 className="text-3xl font-bold text-gray-800">Community Stories</h2>

          <div className="flex items-center gap-4">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-indigo-500"
            >
              <option value="desc">Newest to Oldest</option>
              <option value="asc">Oldest to Newest</option>
            </select>

            <button
              onClick={() => {
                if (!userInfo?.userFound) {
                  toast.warn("Please log in to post a story.");
                  navigate("/login");
                } else {
                  navigate("/create-story");
                }
              }}
              className="bg-[#7f6363] hover:bg-[#6e5656] text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Post a Story
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <p className="text-center text-gray-600">Loading stories...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error.message}</p>
        ) : sortedStories?.length === 0 ? (
          <p className="text-center text-gray-600">No stories posted yet.</p>
        ) : (
          <>
            <div className="space-y-10">
              {paginatedStories.map((story) => {
                const imageIndex = currentImageIndex[story._id] || 0;
                const isExpanded = expandedStoryIds.includes(story._id);
                const shortDesc = story.description.slice(0, 250);

                return (
                  <div
                    key={story._id}
                    className="bg-white rounded-lg shadow-lg hover:shadow-xl transition overflow-hidden"
                  >
                    {/* Carousel */}
                    {story.images?.length > 0 && (
                      <div className="relative w-full h-[450px]">
                        <img
                          src={story.images[imageIndex]}
                          alt={`Story ${imageIndex}`}
                          className="w-full h-full object-cover"
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

                    {/* Content */}
                    <div className="p-6 space-y-4">
                      <h3 className="text-2xl font-bold text-[#7f6363]">{story.title}</h3>

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
                          Posted by {story.user?.fullname || "Anonymous"} •{" "}
                          {formatDistanceToNow(new Date(story.createdAt), { addSuffix: true })}
                        </span>

                        {userInfo?.userFound?._id === story?.user?._id && (
                          <button
                            onClick={() => handleDelete(story._id)}
                            className="text-sm text-red-600 hover:text-red-800 font-medium"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            <div className="mt-10 flex justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    page === i + 1
                      ? "bg-[#7f6363] text-white"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
