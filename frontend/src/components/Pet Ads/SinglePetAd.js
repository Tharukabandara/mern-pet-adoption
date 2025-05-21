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
    <div className="bg-white">
      <main className="mx-auto mt-8 max-w-2xl px-4 pb-16 sm:px-6 sm:pb-24 lg:max-w-7xl lg:px-8">
        <div className="lg:grid lg:auto-rows-min lg:grid-cols-12 lg:gap-x-8">
          {/* Title and Price */}
          <div className="lg:col-span-5 lg:col-start-8">
            <div className="flex justify-between items-start">
              <h1 className="text-2xl font-bold text-gray-900">{ad.title}</h1>
              <p className="text-2xl font-bold text-indigo-700">Rs. {ad.price}</p>
            </div>
            <p className="mt-2 text-sm text-gray-500">Posted in {ad.location}</p>
          </div>

          {/* Image Carousel */}
          <div className="mt-8 lg:col-span-7 lg:col-start-1 lg:row-span-3 lg:row-start-1 flex flex-col items-center">
            {images.length > 0 && (
              <div className="relative w-full max-w-md mx-auto flex items-center justify-center">
                <button
                  onClick={goToPreviousImage}
                  className="absolute left-0 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-l"
                >
                  &#8592;
                </button>

                <img
                  src={images[currentImageIndex]}
                  alt={`Pet ${currentImageIndex + 1}`}
                  className="rounded-lg object-contain max-h-[400px] w-full"
                />

                <button
                  onClick={goToNextImage}
                  className="absolute right-0 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-r"
                >
                  &#8594;
                </button>
              </div>
            )}

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="mt-4 flex space-x-2">
                {images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    className={`h-14 w-14 rounded border cursor-pointer ${
                      index === currentImageIndex ? "border-indigo-500" : "border-gray-300"
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="mt-8 lg:col-span-5">
            <div className="space-y-4">
              <div>
                <h2 className="text-sm font-medium text-gray-900">Description</h2>
                <p className="mt-2 text-gray-700 whitespace-pre-line">{ad.description}</p>
              </div>

              <div className="text-sm text-gray-700 space-y-2">
                <p><span className="font-medium">Pet Category:</span> {ad.petCategory}</p>
                <p><span className="font-medium">Phone:</span> {ad.phone}</p>
                <p><span className="font-medium">Location:</span> {ad.location}</p>
              </div>

              {/* Contact Buttons */}
                {ad.phone && (
                  <div className="flex flex-wrap gap-4 mt-4">
                    <a
                      href={`https://wa.me/+94${String(ad.phone).replace(/^0/, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium"
                    >
                      <FaWhatsapp className="mr-2" /> WhatsApp
                    </a>

                    <a
                      href={`tel:${ad.phone}`}
                      className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
                    >
                      📞 Call Now
                    </a>
                  </div>
                )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
