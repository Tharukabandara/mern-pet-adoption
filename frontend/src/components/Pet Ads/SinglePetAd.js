import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPetAdAction } from "../../redux/slices/petAds/petAdSlices";
import { useParams } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";

export default function SinglePetAd() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { petAd, loading, error } = useSelector((state) => state.petAds);
  const ad = petAd?.petAd || {};
  const images = ad.images || [];

  useEffect(() => {
    dispatch(fetchPetAdAction(id));
  }, [dispatch, id]);

  const goToNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const goToPreviousImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  if (loading) return <div className="text-center py-10 text-lg">Loading...</div>;
  if (error) return <div className="text-red-500 text-center py-10">{error?.message}</div>;

  return (
    <div className="bg-white py-10 px-4 max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-12 gap-10">
        
        {/* Left Column: Title, Image Carousel, Thumbnails */}
        <div className="lg:col-span-8 space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">{ad.title}</h1>
          <p className="text-sm text-gray-600">
            Posted on {new Date(ad.createdAt).toLocaleString()}, {ad.location}
          </p>

          {/* Main Image with Nav Buttons */}
          {images.length > 0 && (
            <div className="relative max-w-full h-[400px] bg-gray-50 rounded overflow-hidden flex items-center justify-center">
              <button
                onClick={goToPreviousImage}
                className="absolute left-2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow"
              >
                &#8592;
              </button>

              <img
                src={images[currentImageIndex]}
                alt={`Pet ${currentImageIndex + 1}`}
                className="object-contain max-h-full w-full rounded"
              />

              <button
                onClick={goToNextImage}
                className="absolute right-2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow"
              >
                &#8594;
              </button>
            </div>
          )}

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="mt-4 flex gap-2 overflow-x-auto">
              {images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`h-20 w-20 object-cover rounded border cursor-pointer ${
                    index === currentImageIndex
                      ? "border-indigo-500"
                      : "border-gray-300"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Description */}
          <div>
            <h2 className="text-lg font-semibold mb-1">Description</h2>
            <p className="text-gray-700 whitespace-pre-line">{ad.description}</p>
          </div>
        </div>

        {/* Right Column: Seller Info & Contact */}
        <div className="lg:col-span-4">
          <div className="border rounded-lg shadow-sm p-6 space-y-4">
            <div>
              <p className="text-sm text-gray-500">For sale by</p>
              <p className="text-lg font-semibold text-gray-800">
                {ad.user?.fullname || "Unknown Seller"}
              </p>
            </div>

            <div>
              <p className="font-semibold text-gray-800 text-xl mb-1">
                {ad.price === 0 ? "Free" : `Rs. ${ad.price}`}
              </p>
              <p className="text-sm text-gray-600">Category: {ad.petCategory}</p>
            </div>

            {/* Contact Buttons */}
            {ad.phone && (
              <div className="flex flex-col gap-3 pt-2">
                <a
                  href={`tel:${ad.phone}`}
                  className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium"
                >
                  📞 Call Seller
                </a>

                <a
                  href={`https://wa.me/+94${String(ad.phone).replace(/^0/, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-medium"
                >
                  <FaWhatsapp className="mr-2" /> WhatsApp
                </a>
              </div>
            )}

            {/* Alert Box */}
            <div className="mt-6 p-4 bg-blue-50 text-sm text-blue-800 border border-blue-200 rounded">
              <strong>Stay Alert:</strong> Avoid scams. Never send money without verifying the seller.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
