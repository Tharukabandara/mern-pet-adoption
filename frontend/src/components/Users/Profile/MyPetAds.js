import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyPetAdsAction, deletePetAdAction } from "../../../redux/slices/petAds/petAdSlices";
import { toast } from "react-toastify";

export default function MyPetAds() {
  const dispatch = useDispatch();
  const { petAds, loading, error } = useSelector((state) => state.petAds);

  useEffect(() => {
    dispatch(fetchMyPetAdsAction());
  }, [dispatch]);

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this ad?");
    if (confirmDelete) {
      dispatch(deletePetAdAction(id))
        .unwrap()
        .then(() => {
          toast.success("Advertisement deleted successfully");
          dispatch(fetchMyPetAdsAction());
        })
        .catch((err) => {
          toast.error(err?.message || "Failed to delete ad");
        });
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">My Pet Advertisements</h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading your ads...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error.message}</p>
      ) : petAds?.length === 0 ? (
        <p className="text-center text-gray-500">You have not posted any ads yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {petAds.map((ad) => (
            <div
              key={ad._id}
              className="border rounded-lg overflow-hidden shadow hover:shadow-md transition bg-white"
            >
              <img
                src={ad?.images?.[0] || "/placeholder.png"}
                alt={ad.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 space-y-2">
                <h4 className="text-lg font-semibold text-gray-800">{ad.title}</h4>
                <p className="text-sm text-gray-600">Rs. {ad.price}</p>
                <p className="text-xs text-gray-500">{ad.location}</p>
                <p className="text-xs text-gray-500">{new Date(ad.createdAt).toLocaleDateString()}</p>
                <button
                  onClick={() => handleDelete(ad._id)}
                  className="mt-2 bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 text-sm"
                >
                  Delete Ad
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
