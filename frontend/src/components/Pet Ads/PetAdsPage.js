import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPetAdsAction } from "../../redux/slices/petAds/petAdSlices";
import { fetchPetCategoriesAction } from "../../redux/slices/categories/petCategoriesSlice";
import { useNavigate, useLocation, Link } from "react-router-dom";
import queryString from "query-string";
import { Disclosure } from "@headlessui/react";
import Slider from "@mui/material/Slider";
import { MinusIcon, PlusIcon } from "@heroicons/react/20/solid";

export default function PetAdsPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const query = queryString.parse(location.search);

  const { petCategory, price, title = "", page = 1 } = query;
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [searchTitle, setSearchTitle] = useState(title);

  const { petAds, loading, error } = useSelector((state) => state.petAds);
  const { petCategories } = useSelector((state) => state.petCategories);

  useEffect(() => {
    dispatch(fetchPetCategoriesAction());
  }, [dispatch]);

  useEffect(() => {
    const filters = {
      ...(petCategory && { petCategory }),
      ...(price && { price }),
      ...(title && { title }),
      ...(page && { page }),
    };
    dispatch(fetchPetAdsAction(filters));
  }, [dispatch, location.search]);

  const updateQuery = (updatedParams) => {
    const merged = { ...query, ...updatedParams };
    const newQuery = queryString.stringify(merged);
    navigate(`/pet-ads?${newQuery}`);
  };

  const clearFilters = () => {
    setPriceRange([0, 10000]);
    setSearchTitle("");
    navigate("/pet-ads");
  };

  const setCategory = (catName) => updateQuery({ petCategory: catName });
  const applyPriceFilter = () => updateQuery({ price: `${priceRange[0]}-${priceRange[1]}` });
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateQuery({ title: searchTitle });
  };

  const handleSliderChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  const totalPages = 5; // Placeholder — should come from backend pagination
  const paginationButtons = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Pet Advertisements</h1>
        <Link
          to="/create-pet-ad"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Post an Ad
        </Link>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearchSubmit} className="mb-4 flex gap-2">
        <input
          type="text"
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
          placeholder="Search by title"
          className="border rounded px-4 py-2 flex-grow"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 rounded">
          Search
        </button>
        <button type="button" onClick={clearFilters} className="bg-red-200 text-red-600 px-4 rounded">
          Clear filters
        </button>
      </form>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pet Category Filter */}
          <div>
            <h3 className="text-lg font-medium">Pet Categories</h3>
            {petCategories?.petCategories?.map((cat) => (
              <div key={cat._id}>
                <input
                  type="radio"
                  name="petCategory"
                  onClick={() => setCategory(cat.name)}
                  checked={petCategory === cat.name}
                  className="mr-2"
                />
                <label>{cat.name}</label>
              </div>
            ))}
          </div>

          {/* Price Filter */}
          <Disclosure as="div" className="border-t border-gray-200 px-4 py-6">
            {({ open }) => (
              <>
                <Disclosure.Button className="flex justify-between w-full text-gray-400 hover:text-gray-500">
                  <span className="text-gray-900">Price Range</span>
                  <span>{open ? <MinusIcon className="h-5 w-5" /> : <PlusIcon className="h-5 w-5" />}</span>
                </Disclosure.Button>
                <Disclosure.Panel className="pt-6">
                  <div className="px-2">
                    <Slider
                      value={priceRange}
                      min={0}
                      max={10000}
                      onChange={handleSliderChange}
                      valueLabelDisplay="auto"
                      step={500}
                    />
                    <button
                      type="button"
                      onClick={applyPriceFilter}
                      className="mt-2 bg-indigo-600 text-white px-4 py-1 rounded"
                    >
                      Apply
                    </button>
                  </div>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        </div>

        {/* Pet Ads Section */}
        <div className="lg:col-span-3">
          {loading ? (
            <p>Loading ads...</p>
          ) : error ? (
            <p className="text-red-500">{error.message}</p>
          ) : petAds?.length === 0 ? (
            <p>No ads found.</p>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {petAds.map((ad) => (
                  <Link
                    to={`/pet-ads/${ad._id}`}
                    key={ad._id}
                    className="border rounded-lg overflow-hidden shadow hover:shadow-md transition"
                  >
                    <img
                      src={ad?.images?.[0]}
                      alt={ad.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h4 className="text-lg font-semibold">{ad.title}</h4>
                      <p className="text-sm text-gray-600">Rs. {ad.price}</p>
                      <p className="text-xs text-gray-500 mt-1">{ad.location}</p>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-6 flex justify-center gap-2">
                {paginationButtons.map((p) => (
                  <button
                    key={p}
                    onClick={() => updateQuery({ page: p })}
                    className={`px-3 py-1 rounded ${p == page ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
