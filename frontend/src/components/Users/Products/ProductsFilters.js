import { Fragment, useEffect, useState } from "react";
import {
  Dialog,
  Disclosure,
  Transition,
} from "@headlessui/react";
import {
  XMarkIcon,
  FunnelIcon,
  MinusIcon,
  PlusIcon,
} from "@heroicons/react/20/solid";
import Products from "./Products";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsAction } from "../../../redux/slices/products/productSlices";
import { fetchCategoriesAction } from "../../../redux/slices/categories/categoriesSlice";
import { fetchPetCategoriesAction } from "../../../redux/slices/categories/petCategoriesSlice";
import { useLocation, useNavigate } from "react-router-dom";
import queryString from "query-string";
import Slider from "@mui/material/Slider";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ProductsFilters() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { category, pet, price, sort } = queryString.parse(location.search);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedPet, setSelectedPet] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const { loading: productsLoading, error: productsError, products } = useSelector(
    (state) => state?.products
  );
  const { categories } = useSelector((state) => state.categories);
  const { petCategories: petCatState } = useSelector((state) => state.petCategories);
  const petCategoryList = petCatState?.petCategories || [];

  useEffect(() => {
    dispatch(fetchCategoriesAction());
    dispatch(fetchPetCategoriesAction());
  }, [dispatch]);

  useEffect(() => {
    const { category, pet, price, sort } = queryString.parse(location.search);
    const filters = {
      ...(category && { productCategory: category }),
      ...(pet && { petCategory: pet }),
      ...(price && { price }),
      ...(sort && { sort }),
    };
    dispatch(fetchProductsAction(filters));
  }, [dispatch, location.search]);

  const updateQuery = (updatedParams) => {
    const currentParams = queryString.parse(location.search);
    const merged = { ...currentParams, ...updatedParams };
    const query = queryString.stringify(merged);
    navigate(`/products-filters?${query}`);
  };

  const clearFilters = () => {
    setPriceRange([0, 1000]);
    setSelectedPet("");
    setSelectedCategory("");
    navigate("/products-filters");
  };

  const setPrice = (range) => updateQuery({ price: range });
  const setPet = (petName) => {
    setSelectedPet(petName);
    updateQuery({ pet: petName });
  };
  const setCategory = (catName) => {
    setSelectedCategory(catName);
    updateQuery({ category: catName });
  };

  const handleSliderChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  const applyPriceFilter = () => {
    updateQuery({ price: `${priceRange[0]}-${priceRange[1]}` });
  };

  return (
    <div className="bg-white">
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-baseline justify-between border-b border-gray-200 pt-24 pb-6">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Product Filters
          </h1>
          <button
            type="button"
            onClick={clearFilters}
            className="bg-red-100 text-red-600 px-4 py-2 rounded hover:bg-red-200">
            Clear All Filters
          </button>
        </div>

        <section aria-labelledby="products-heading" className="pt-6 pb-24">
          <h2 id="products-heading" className="sr-only">
            Products
          </h2>
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
            <form className="hidden lg:block">
              {/* Price Range Slider */}
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
                          max={1000}
                          onChange={handleSliderChange}
                          valueLabelDisplay="auto"
                          step={10}
                        />
                        <button
                          type="button"
                          onClick={applyPriceFilter}
                          className="mt-2 bg-indigo-600 text-white px-4 py-1 rounded">
                          Apply
                        </button>
                      </div>
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>

              {/* Pet Category Filter */}
              <Disclosure as="div" className="border-t border-gray-200 px-4 py-6">
                {({ open }) => (
                  <>
                    <Disclosure.Button className="flex justify-between w-full text-gray-400 hover:text-gray-500">
                      <span className="text-gray-900">Pet Category</span>
                      <span>{open ? <MinusIcon className="h-5 w-5" /> : <PlusIcon className="h-5 w-5" />}</span>
                    </Disclosure.Button>
                    <Disclosure.Panel className="pt-6">
                      <div className="space-y-6">
                        {petCategoryList.map((pet) => (
                          <div key={pet._id} className="flex items-center">
                            <input
                              onChange={() => setPet(pet.name)}
                              checked={selectedPet === pet.name}
                              name="pet"
                              type="radio"
                              className="h-4 w-4 text-indigo-600 border-gray-300"
                            />
                            <label className="ml-3 text-gray-500">{pet.name}</label>
                          </div>
                        ))}
                      </div>
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>

              {/* Product Category Filter */}
              <Disclosure as="div" className="border-t border-gray-200 px-4 py-6">
                {({ open }) => (
                  <>
                    <Disclosure.Button className="flex justify-between w-full text-gray-400 hover:text-gray-500">
                      <span className="text-gray-900">Product Category</span>
                      <span>{open ? <MinusIcon className="h-5 w-5" /> : <PlusIcon className="h-5 w-5" />}</span>
                    </Disclosure.Button>
                    <Disclosure.Panel className="pt-6">
                      <div className="space-y-6">
                        {categories?.categories?.map((cat) => (
                          <div key={cat._id} className="flex items-center">
                            <input
                              onChange={() => setCategory(cat.name)}
                              checked={selectedCategory === cat.name}
                              name="category"
                              type="radio"
                              className="h-4 w-4 text-indigo-600 border-gray-300"
                            />
                            <label className="ml-3 text-gray-500">{cat.name}</label>
                          </div>
                        ))}
                      </div>
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            </form>

            {/* Product Results */}
            <div className="lg:col-span-3">
              {productsLoading ? (
                <p className="text-xl text-gray-600">Loading products...</p>
              ) : productsError ? (
                <p className="text-red-500">{productsError}</p>
              ) : (
                <Products products={products} />
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
