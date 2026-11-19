import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import { validateEmail } from "../util/validation";
import axiosConfig from "../util/axios";
import { Endpoints } from "../util/apiEndpoints";
import { AppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { LoaderCircle } from "lucide-react";
import { addUser } from "../indexeddb/indexeddb";
import { useDispatch } from "react-redux";
import { updateProfile } from "../redux/profileSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useContext(AppContext);
  const dispatch = useDispatch();

  const navigate = useNavigate();
  async function submit(e) {
    e.preventDefault();
    setIsLoading(true);

    if (!validateEmail(email)) {
      setError("Please enter your valid email");
      setIsLoading(false);
      return;
    }

    if (!password.trim()) {
      setError("Please enter your password");
      setIsLoading(false);
      return;
    }

    setError("");

    try {
      const response = await axiosConfig.post(Endpoints.LOGIN, {
        email: email,
        password: password,
      });
      const { token, user } = response.data;
      if (token) {
        localStorage.setItem("token", token);
        setUser(user);
        addUser(user);
        console.log(user);
        dispatch(updateProfile(user));
        navigate("/dashboard");
        toast.success("Successfully login");
      }
    } catch (err) {
      console.log(err);
      setError(err.response.data.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="h-screen w-full relative flex items-center justify-center overflow-hidden">
      <img
        src="logo-bg.png"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover filter blur-sm"
      />

      <div className="relative z-10 w-full max-w-lg px-6 scale-90">
        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-2xl p-8 max-h-[90vh] overflow-y-auto">
          <h3 className="text-2xl font-semibold text-black text-center mb-2">
            Welcome back
          </h3>
          <p className="text-sm text-slate-700 text-center mb-8">
            Please enter your details to login
          </p>

          <form onSubmit={submit} className="space-y-4">
            <div className="flex justify-center mb-6"></div>

            <Input
              value={email}
              type="text"
              placeholder="Enter your email"
              label="Email"
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              value={password}
              type="password"
              placeholder="*********"
              label="Password"
              onChange={(e) => setPassword(e.target.value)}
            />

            <div>
              {error && (
                <p className="text-red-800 text-sm text-center bg-red-50 p-2 rounded">
                  {error}
                </p>
              )}
            </div>
            <button
              disabled={isLoading}
              className={`bg-purple-700 text-white font-semibold rounded-2xl w-full py-3 text-lg hover:bg-purple-600 hover:scale-102 transition duration-300  flex items-center justify-center gap-2 ${isLoading ? "opacity-60 cursor-not-allowed" : ""}`}
              type="submit"
            >
              {isLoading ? (
                <>
                  <LoaderCircle className="w-5 h-5 animate-spin" />
                  Logging in...
                </>
              ) : (
                "LOGIN"
              )}
            </button>
            <p className="text-sm text-slate-800 text-center mt-6">
              Create a new account{" "}
              <Link
                to="/signup"
                className="font-medium text-purple-600 underline hover:text-primary-dark transition-colors"
              >
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
