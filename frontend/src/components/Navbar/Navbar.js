import { Fragment, useState } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  ShoppingCartIcon,
  UserIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
  RectangleStackIcon,
  MapPinIcon,
  NewspaperIcon,
} from "@heroicons/react/24/solid";
import { Link, useNavigate } from "react-router-dom";
import logo from "./Logo.png";
import { useDispatch, useSelector } from "react-redux";
import { logoutUserAction } from "../../redux/slices/users/usersSlice";
import { toast } from "react-toastify";
import { clearCart } from "../../redux/slices/cart/cartSlice";


export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.users.userAuth || {});
  const { cartItems } = useSelector((state) => state.cart);
  const isLoggedIn = !!userInfo?.userFound;
  const isAdmin = userInfo?.userFound?.isAdmin;

  const handleLogout = () => {
    dispatch(logoutUserAction());
    dispatch(clearCart());
    toast.success("Successfully logged out.");
    navigate("/");
  };

  return (
    <div className="bg-white shadow">
      {/* Mobile Menu */}
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
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-6 border-t border-gray-200 py-6 px-4">
                  <Link to="/" className="block text-sm font-medium text-gray-700">Home</Link>
                  <Link to="/story-feed" className="block text-sm font-medium text-gray-700">Story Feed</Link>
                  <Link to="/pet-ads" className="block text-sm font-medium text-gray-700">Pet Ads</Link>
                  <Link to="/products" className="block text-sm font-medium text-gray-700">Pet Accessories</Link>
                  {isAdmin && (
                    <Link to="/admin" className="block text-sm font-medium text-indigo-600">Admin Dashboard</Link>
                  )}
                </div>

                <div className="border-t border-gray-200 py-6 px-4 space-y-4">
                  {!isLoggedIn ? (
                    <>
                      <Link to="/register" className="flex items-center gap-2 text-sm font-medium text-gray-900">
                        <UserCircleIcon className="h-5 w-5" />
                        Register
                      </Link>
                      <Link to="/login" className="flex items-center gap-2 text-sm font-medium text-gray-900">
                        <ArrowRightOnRectangleIcon className="h-5 w-5" />
                        Sign In
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link to="/customer-profile" className="flex items-center gap-2 text-sm font-medium text-gray-900">
                        <UserIcon className="h-5 w-5" />
                        Profile
                      </Link>
                      <Link to="/my-ads" className="flex items-center gap-2 text-sm font-medium text-gray-900">
                        <RectangleStackIcon className="h-5 w-5" />
                        My Ads
                      </Link>
                      <Link to="/my-stories" className="flex items-center gap-2 text-sm font-medium text-gray-900">
                      <NewspaperIcon className="h-5 w-5" />
                      My Stories
                    </Link>
                      <Link to="/shipping-address" className="flex items-center gap-2 text-sm font-medium text-gray-900">
                        <MapPinIcon className="h-5 w-5" />
                        Shipping Address
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-800"
                      >
                        <ArrowRightOnRectangleIcon className="h-5 w-5" />
                        Logout
                      </button>
                    </>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Main Nav */}
      <header className="relative z-10">
        <nav aria-label="Top">
          <div className="bg-white border-b border-gray-200">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-20 items-center justify-between">
                {/* Logo */}
                <div className="flex-shrink-0">
                  <Link to="/">
                    <img className="h-24 w-auto" src={logo} alt="Paw Mart" />
                  </Link>
                </div>

                {/* Center Links */}
                <div className="hidden lg:flex lg:gap-8">
                  <Link to="/" className="text-sm font-medium text-gray-700 hover:text-gray-900">Home</Link>
                  <Link to="/story-feed" className="block text-sm font-medium text-gray-700">Story Feed</Link>
                  <Link to="/pet-ads" className="text-sm font-medium text-gray-700 hover:text-gray-900">Pet Advertisement </Link>
                  <Link to="/products" className="text-sm font-medium text-gray-700 hover:text-gray-900">Pet Accessories</Link>
                  {isAdmin && (
                    <Link to="/admin" className="text-sm font-medium text-indigo-700 hover:text-indigo-900">Admin Dashboard</Link>
                  )}
                </div>

                {/* Mobile Menu Button */}
                <div className="flex lg:hidden">
                  <button
                    type="button"
                    className="-ml-2 p-2 text-gray-400"
                    onClick={() => setMobileMenuOpen(true)}
                  >
                    <Bars3Icon className="h-6 w-6" />
                  </button>
                </div>

                {/* Right Side Icons */}
                <div className="flex items-center gap-4">
                  <Link to="/shopping-cart" className="relative group">
                    <ShoppingCartIcon className="h-6 w-6 text-gray-500 group-hover:text-gray-700" />
                    <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                      {cartItems?.length || 0}
                    </span>
                  </Link>

                  {/* User Icon & Dropdown */}
                  {isLoggedIn ? (
                    <Menu as="div" className="relative inline-block text-left">
                      <Menu.Button className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200">
                        <UserIcon className="h-6 w-6 text-gray-600" />
                      </Menu.Button>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <div className="py-1">
                            <Menu.Item>
                              {({ active }) => (
                                <Link
                                  to="/customer-profile"
                                  className={`${
                                    active ? "bg-gray-100" : ""
                                  } flex items-center gap-2 px-4 py-2 text-sm text-gray-700`}
                                >
                                  <UserIcon className="h-5 w-5" />
                                  My Orders
                                </Link>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <Link
                                  to="/my-ads"
                                  className={`${
                                    active ? "bg-gray-100" : ""
                                  } flex items-center gap-2 px-4 py-2 text-sm text-gray-700`}
                                >
                                  <RectangleStackIcon className="h-5 w-5" />
                                  My Advertisements
                                </Link>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <Link
                                  to="/my-stories"
                                  className={`${
                                    active ? "bg-gray-100" : ""
                                  } flex items-center gap-2 px-4 py-2 text-sm text-gray-700`}
                                >
                                  <NewspaperIcon className="h-5 w-5" />
                                  My Stories
                                </Link>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <Link
                                  to="/shipping-address"
                                  className={`${
                                    active ? "bg-gray-100" : ""
                                  } flex items-center gap-2 px-4 py-2 text-sm text-gray-700`}
                                >
                                  <MapPinIcon className="h-5 w-5" />
                                  Shipping Address
                                </Link>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  onClick={handleLogout}
                                  className={`${
                                    active ? "bg-gray-100" : ""
                                  } w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600`}
                                >
                                  <ArrowRightOnRectangleIcon className="h-5 w-5" />
                                  Logout
                                </button>
                              )}
                            </Menu.Item>
                          </div>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  ) : (
                    <>
                      <Link to="/register" className="text-sm text-gray-700 hover:text-blue-700 font-medium">
                        Register
                      </Link>
                      <Link to="/login" className="text-sm text-gray-700 hover:text-blue-700 font-medium">
                        Sign In
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
}
