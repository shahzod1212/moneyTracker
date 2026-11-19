import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import { validateEmail } from "../util/validation";
import axiosConfig from "../util/axios";
import { Endpoints } from "../util/apiEndpoints";
import toast from "react-hot-toast";
import { LoaderCircle } from "lucide-react";
import PhotoSelector from "../context/PhotoSelector";
import uploadFile from "../util/uplodImage";
import { useDispatch } from "react-redux";
import { setUploadImageUrl, updateProfile } from "../redux/profileSlice";

const Signup = () => {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();

    setIsLoading(true);

    if (!fullname.trim()) {
      setError("Please enter your name");
      setIsLoading(false);
      return;
    }

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
      let imageUrl = "";

      if (profilePhoto) {
        imageUrl = await uploadFile(profilePhoto);
        dispatch(setUploadImageUrl(imageUrl));
      }

      const response = await axiosConfig.post(Endpoints.SIGNUP, {
        fullName: fullname,
        email: email,
        password: password,
        profileImageUrl: imageUrl,
      });

      if (response.status === 201) {
        toast.success("Profile successfully created");
        dispatch(updateProfile(response.data));
        navigate("/login");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
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
            Create an account
          </h3>
          <p className="text-sm text-slate-700 text-center mb-8">
            Start you tracking spendings right now
          </p>

          <form onSubmit={submit} className="space-y-4">
            <div className="flex justify-center mb-6">
              <PhotoSelector image={profilePhoto} setImage={setProfilePhoto} />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
              <Input
                value={fullname}
                type="text"
                placeholder="Enter your full Name"
                label="Full Name"
                onChange={(e) => setFullname(e.target.value)}
              />
              <Input
                value={email}
                type="text"
                placeholder="Enter your email"
                label="Email"
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="col-span-2">
                <Input
                  value={password}
                  type="password"
                  placeholder="*********"
                  label="Password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <div>
              {error && (
                <p className="text-red-800 text-sm text-center bg-red-50 p-2 rounded">
                  {error}
                </p>
              )}
            </div>
            <button
              disabled={isLoading}
              onClick={submit}
              className={`bg-purple-700 text-white font-semibold rounded-2xl w-full flex items-center justify-center gap-2 ${isLoading ? "opacity-60 cursor-not-allowed" : ""} py-3 text-lg hover:bg-purple-600 hover:scale-102 transition duration-300`}
              type="submit"
            >
              {isLoading ? (
                <>
                  <LoaderCircle className="animate-spin w-5 h-5 " />
                  Signing up
                </>
              ) : (
                "SIGN UP"
              )}
            </button>
            <p className="text-sm text-slate-800 text-center mt-6">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-purple-600 underline hover:text-primary-dark transition-colors"
              >
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
