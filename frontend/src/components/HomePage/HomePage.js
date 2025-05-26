import { Link } from "react-router-dom";
import HomeCategories from "./HomeCategories";
import HomeProductTrending from "./HomeProductTrending";
import welcomeImage from "./Welcome.png";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Example() {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className="bg-[#ede4dd]">
      <main>
        {/* Welcome Hero Section */}
        <div
          className="relative bg-cover bg-center h-[90vh] px-4 sm:px-6 lg:px-8 flex items-center"
          style={{ backgroundImage: `url(${welcomeImage})` }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <div
            className="relative max-w-3xl mx-auto text-center text-white"
            data-aos="fade-up"
          >
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl xl:text-6xl">
              Online Shopping Like Never Before
            </h1>
            <p className="mt-4 text-lg sm:text-xl">
              Leading Platform of Pet Adoption and Marketplace for Pet Accessories in Sri Lanka.
            </p>
            <div className="mt-10">
              <a
                href="/pet-ads"
                className="inline-block rounded-md bg-[#7f6363] hover:bg-[#6e5656] py-3 px-8 font-medium text-white transition"
              >
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
            data-aos="fade-up"
          >
            <div className="mx-auto max-w-2xl lg:max-w-none">
              <h2
                id="sale-heading"
                className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl"
              >
                Explore our wide Range of Pet Accessories
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-xl text-gray-600">
                Most of our products are limited releases that won't come back.
                Get your favorite items while they're in stock.
              </p>
              <a
                href="/products"
                className="mt-6 inline-block w-full rounded-md border border-transparent bg-[#7f6363] hover:bg-[#6e5656] py-3 px-8 font-medium text-white sm:w-auto"
              >
                Shop Pet Accessories
              </a>
            </div>
          </section>
        </div>

        {/* Category Section */}
        <section
          aria-labelledby="category-heading"
          className="pt-24 sm:pt-32 xl:mx-auto xl:max-w-7xl xl:px-8"
          data-aos="fade-up"
        >
          <div className="px-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8 xl:px-0">
            <h2
              id="category-heading"
              className="text-2xl font-bold tracking-tight text-gray-900"
            >
              Shop by Category
            </h2>
            <Link
              to="/all-categories"
              className="hidden text-sm font-semibold text-[#7f6363] hover:text-[#5f4e4e] sm:block"
            >
              Browse all categories <span aria-hidden="true"> &rarr;</span>
            </Link>
          </div>
          <div className="px-4 sm:px-6 lg:px-8">
            <HomeCategories />
          </div>
        </section>

        {/* Trending Section */}
        <div className="px-4 sm:px-6 lg:px-8" data-aos="fade-up">
          <HomeProductTrending />
        </div>
      </main>

      {/* Footer */}
            <footer className="bg-[#7f6363] text-white mt-20 py-10 px-6 sm:px-10" data-aos="fade-up">
              <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-xl font-bold mb-2">Paw Mart</h3>
                  <p>Connecting you with pets and accessories easily.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Quick Links</h4>
                  <ul className="space-y-1">
                    <li><Link to="/" className="hover:underline">Home</Link></li>
                    <li><Link to="/story-feed" className="hover:underline">Story Feed</Link></li>
                    <li><Link to="/pet-ads" className="hover:underline">Pet Advertisements</Link></li>
                    <li><Link to="/products" className="hover:underline">Pet Accessories</Link></li>
                    <li><Link to="/about-us" className="hover:underline">About Us</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Contact</h4>
                  <p>Email: support@petmart.lk</p>
                  <p>Phone: +94 76 916 6548</p>
                </div>
              </div>
              <p className="text-center mt-6 text-gray-300 text-sm">
                &copy; {new Date().getFullYear()} Paw Mart. All rights reserved.
              </p>
            </footer>
    </div>
  );
}
