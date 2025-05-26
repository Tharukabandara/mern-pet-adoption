import React from "react";
import { Link } from "react-router-dom";

export default function AboutUs() {
  return (
    <div className="bg-[#ede4dd] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-base text-[#7f6363] font-semibold tracking-wide uppercase">
            About Us
          </h2>
          <p className="mt-2 text-4xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Connecting Pet Lovers with Compassion
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            We’re on a mission to help stray animals find love, and help pet lovers find what they need.
          </p>
        </div>

        {/* Image and Description */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <img
            src="https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            alt="Pet Love"
            className="rounded-lg shadow-lg"
          />
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Who We Are</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Paw Mart is a community-driven platform where animal lovers can
              connect, share, and support pet adoption, accessories, and welfare. We
              aim to reduce the number of stray animals and create a space for pet
              enthusiasts to support and uplift each other.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Whether you're looking to adopt, promote a free vet service, sell
              pet accessories, or spread awareness, our platform makes it simple and meaningful.
            </p>
          </div>
        </div>

        {/* Mission + Vision */}
        <div className="mt-16 grid md:grid-cols-2 gap-10">
          <div className="bg-indigo-50 p-6 rounded-lg shadow-md">
            <h4 className="text-xl font-bold text-indigo-700 mb-2">Our Mission</h4>
            <p className="text-gray-700">
              To provide a centralized hub for pet lovers to connect, adopt, sell
              responsibly, and contribute to the welfare of stray animals and
              community services.
            </p>
          </div>
          <div className="bg-green-50 p-6 rounded-lg shadow-md">
            <h4 className="text-xl font-bold text-green-700 mb-2">Our Vision</h4>
            <p className="text-gray-700">
              A future where no animal is abandoned, and every pet gets the love and
              care they deserve—backed by a strong, compassionate online community.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to join our mission?
          </h3>
          <Link
            to="/story-feed"
            className="inline-block bg-[#7f6363] hover:bg-[#6e5656] text-white font-semibold py-3 px-6 rounded-md shadow-md transition"
          >
            Share Your Story
          </Link>
        </div>
      </div>
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
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Contact</h4>
            <p>Email: support@pawmart.lk</p>
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
