import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUserAction } from "../../../redux/slices/users/usersSlice";
import LoadingComponent from "../../LoadingComp/LoadingComponent";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = location.state?.from || "/";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const onChangeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    dispatch(loginUserAction({ email, password }));
  };

  const { error, loading, userInfo } = useSelector(
    (state) => state?.users?.userAuth
  );

  useEffect(() => {
    if (userInfo?.userFound?.isAdmin) {
      toast.success("Admin login successful");
      navigate("/");
    } else if (userInfo?.userFound) {
      toast.success("Login successful");
      navigate(redirectPath);
    }
    if (error) {
      toast.error(error?.message || "Login failed");
    }
  }, [userInfo, error, navigate, redirectPath]);

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4"
      style={{
        backgroundImage:
          'url("https://images.pexels.com/photos/1276553/pexels-photo-1276553.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2")',
      }}
    >
      <div className="w-full max-w-5xl flex bg-white/70 backdrop-blur-lg rounded-3xl overflow-hidden shadow-2xl">
        {/* Left Panel - Form */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center items-center">
          <div className="w-full max-w-sm">
            <div className="text-center mb-8">
              <div className="text-red-600 text-3xl font-bold">🐾 Paw Mart</div>
              <h2 className="mt-4 text-lg font-semibold text-gray-800">
                Sign In To Continue
              </h2>
            </div>
            <form onSubmit={onSubmitHandler} className="space-y-6">
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={onChangeHandler}
                className="w-full px-4 py-3 border border-gray-300 rounded-full focus:ring-red-500 focus:border-red-500 text-sm bg-white bg-opacity-80"
                required
              />
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={onChangeHandler}
                className="w-full px-4 py-3 border border-gray-300 rounded-full focus:ring-red-500 focus:border-red-500 text-sm bg-white bg-opacity-80"
                required
              />
              {loading ? (
              <LoadingComponent />
            ) : (
              <>
                <button
                  className="w-full bg-[#7f6363] hover:bg-[#6e5656] text-white font-bold py-3 rounded-full transition"
                  type="submit"
                >
                  Login
                </button>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-900 mb-3">Don't have an account?</p>
                  <button
                    type="button"
                    onClick={() => navigate("/register")}
                    className="w-full bg-[#7f6363] hover:bg-[#6e5656] text-white font-bold py-3 rounded-full transition"
                  >
                    Register
                  </button>
                </div>
              </>
            )}
            </form>
            <div className="mt-6 text-center text-xs text-gray-500">
              <span className="hover:underline cursor-pointer mr-4">
                Terms & Conditions
              </span>
              <span className="hover:underline cursor-pointer">
                Privacy Policy
              </span>
            </div>
          </div>
        </div>

        {/* Right Panel - Image */}
        <div
          className="hidden md:block md:w-1/2 bg-cover bg-center"
          style={{
            backgroundImage:
              'url("https://images.pexels.com/photos/160846/french-bulldog-summer-smile-joy-160846.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2")',
          }}
        ></div>
      </div>
    </div>
  );
};

export default Login;
