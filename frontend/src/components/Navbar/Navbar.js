import { Fragment, useState } from "react";
import { Dialog, Popover, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  ShoppingCartIcon,
  UserIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import logo from "./Logo.png";
import { useSelector } from "react-redux";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const categoriesToDisplay = [];

  const { userInfo } = useSelector((state) => state.users.userAuth || {});
  const { cartItems } = useSelector((state) => state.cart);
  const isLoggedIn = !!userInfo?.userFound;

  return (
    <div className="bg-white">
      {/* Mobile menu */}
      <Transition.Root show={mobileMenuOpen} as={Fragment}>
        <Dialog as="div" className="relative z-40 lg:hidden" onClose={setMobileMenuOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-white pb-12 shadow-xl">
                <div className="flex px-4 pt-5 pb-2">
                  <button
                    type="button"
                    className="-m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="space-y-6 border-t border-gray-200 py-6 px-4">
                  <Link to="/" className="block text-sm font-medium text-gray-700">
                    Home
                  </Link>
                  <Link to="/pet-ads" className="block text-sm font-medium text-gray-700">
                    Pet Ads
                  </Link>
                  <Link to="/products" className="block text-sm font-medium text-gray-700">
                    Pet Accessories
                  </Link>
                </div>

                {!isLoggedIn && (
                  <div className="space-y-6 border-t border-gray-200 py-6 px-4">
                    <Link to="/register" className="block text-sm font-medium text-gray-900">
                      Create an account
                    </Link>
                    <Link to="/login" className="block text-sm font-medium text-gray-900">
                      Sign in
                    </Link>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Top Banner */}
      <header className="relative z-10">
        <nav aria-label="Top">
          <div className="bg-[#7f6363]">
            <div className="mx-auto flex h-10 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
              <p className="flex-1 text-center text-sm font-medium text-white lg:flex-none">
                Welcome to Paw Mart
              </p>
              <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
                {!isLoggedIn && (
                  <>
                    <Link to="/register" className="text-sm font-medium text-white hover:text-gray-100">
                      Create an account
                    </Link>
                    <span className="h-6 w-px bg-gray-600" />
                    <Link to="/login" className="text-sm font-medium text-white hover:text-gray-100">
                      Sign in
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="bg-white border-b border-gray-200">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-20 items-center justify-between">
                <div className="hidden lg:flex lg:items-center">
                  <Link to="/">
                    <img className="h-32 pt-2 w-auto" src={logo} alt="Paw Mart" />
                  </Link>
                </div>

                <div className="hidden h-full lg:flex">
                  <Popover.Group className="ml-8">
                    <div className="flex h-full items-center space-x-8">
                      <Link to="/" className="text-sm font-medium text-gray-700 hover:text-gray-800">Home</Link>
                      <Link to="/pet-ads" className="text-sm font-medium text-gray-700 hover:text-gray-800">Pet Ads</Link>
                      <Link to="/products" className="text-sm font-medium text-gray-700 hover:text-gray-800">Pet Accessories</Link>
                    </div>
                  </Popover.Group>
                </div>

                {/* Mobile Menu Button */}
                <div className="flex flex-1 items-center lg:hidden">
                  <button
                    type="button"
                    className="-ml-2 rounded-md bg-white p-2 text-gray-400"
                    onClick={() => setMobileMenuOpen(true)}
                  >
                    <Bars3Icon className="h-6 w-6" />
                  </button>
                </div>

                {/* Logo (Mobile) */}
                <Link to="/" className="lg:hidden">
                  <img className="h-32 mt-2 w-auto" src={logo} alt="Paw Mart" />
                </Link>

                {/* Right Icons */}
                <div className="flex flex-1 items-center justify-end">
                  <div className="flex items-center lg:ml-8 space-x-4">
                    {isLoggedIn && (
                      <Link to="/customer-profile" className="-m-2 p-2 text-gray-400 hover:text-gray-500">
                        <UserIcon className="h-6 w-6" />
                      </Link>
                    )}
                    <Link to="/shopping-cart" className="group -m-2 flex items-center p-2">
                      <ShoppingCartIcon className="h-6 w-6 text-gray-400 group-hover:text-gray-500" />
                      <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
                        {cartItems?.length || 0}
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
}
