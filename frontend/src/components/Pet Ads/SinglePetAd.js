import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPetAdAction } from "../../redux/slices/petAds/petAdSlices";
import { useParams } from "react-router-dom";

export default function SinglePetAd() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { petAd, loading, error } = useSelector((state) => state.petAds);

  useEffect(() => {
    dispatch(fetchPetAdAction(id));
  }, [dispatch, id]);

  if (loading) return <div className="text-center py-10 text-lg">Loading...</div>;
  if (error) return <div className="text-red-500 text-center py-10">{error?.message}</div>;

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Image section */}
        <div>
          <img
            src={petAd?.petAd?.images?.[0]}
            alt={petAd?.petAd?.title}
            className="w-full h-96 object-cover rounded"
          />
        </div>

        {/* Info section */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{petAd?.petAd?.title}</h1>
          <p className="text-lg text-gray-700 mb-4">{petAd?.petAd?.description}</p>

          <div className="space-y-2">
            <p className="text-gray-600">
              <span className="font-semibold">Pet Category:</span>{" "}
              {petAd?.petAd?.petCategory}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Location:</span>{" "}
              {petAd?.petAd?.location}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Phone:</span>{" "}
              {petAd?.petAd?.phone}
            </p>
            <p className="text-gray-900 font-bold text-xl">
              Rs. {petAd?.petAd?.price}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
