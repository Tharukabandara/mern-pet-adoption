import { Link } from "react-router-dom";
import HomeCategories from "./HomeCategories";
import HomeProductTrending from "./HomeProductTrending";
import welcomeImage from "./Welcome.png";

export default function Example() {
  return (
    <div className="bg-[#ede4dd]">
      <main>
        {/* Welcome Hero Section */}
        <div
          className="relative bg-cover bg-center py-32 sm:py-40 px-4 sm:px-6 lg:px-8"
          style={{ backgroundImage: `url(${welcomeImage})` }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <div className="relative max-w-3xl mx-auto text-center text-white">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl xl:text-6xl">
              Online Shopping Like Never Before
            </h1>
            <p className="mt-4 text-lg sm:text-xl">
              Leading Platform of Pet Adoption and Marketplace for Pet Accessories in Sri Lanka.
            </p>
            <div className="mt-10">
              <a
                href="/pet-ads"
                className="inline-block rounded-md bg-indigo-600 hover:bg-indigo-700 py-3 px-8 font-medium text-white transition">
                Visit Pet Ads Section
              </a>
            </div>
          </div>
        </div>

        {/* Explore Accessories Section */}
        <div className="relative overflow-hidden px-4 sm:px-6 lg:px-8">
          <section
            aria-labelledby="sale-heading"
            className="relative mx-auto flex max-w-7xl flex-col items-center pt-24 text-center"
          >
            <div className="mx-auto max-w-2xl lg:max-w-none">
              <h2
                id="sale-heading"
                className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                Explore our wide Range of Pet Accessories
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-xl text-gray-600">
                Most of our products are limited releases that won't come back.
                Get your favorite items while they're in stock.
              </p>
              <a
                href="/products-filters"
                className="mt-6 inline-block w-full rounded-md border border-transparent bg-gray-900 py-3 px-8 font-medium text-white hover:bg-gray-800 sm:w-auto">
                Shop Products
              </a>
            </div>
          </section>
        </div>
      </main>

      {/* Category Section */}
      <main>
        <section
          aria-labelledby="category-heading"
          className="pt-24 sm:pt-32 xl:mx-auto xl:max-w-7xl xl:px-8"
        >
          <div className="px-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8 xl:px-0">
            <h2
              id="category-heading"
              className="text-2xl font-bold tracking-tight text-gray-900">
              Shop by Category
            </h2>
            <Link
              to="/all-categories"
              className="hidden text-sm font-semibold text-indigo-600 hover:text-indigo-500 sm:block">
              Browse all categories
              <span aria-hidden="true"> &rarr;</span>
            </Link>
          </div>
          {/* Home categories */}
          <div className="px-4 sm:px-6 lg:px-8">
            <HomeCategories />
          </div>
        </section>

        {/* Trending Section */}
        <div className="px-4 sm:px-6 lg:px-8">
          <HomeProductTrending />
        </div>
      </main>
    </div>
  );
}
