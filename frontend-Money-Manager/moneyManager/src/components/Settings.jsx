import React, { useEffect, useState } from "react";
import Dashboard from "../components/Dashboard";
import useUser from "../hooks/useUser";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile, removeProfile } from "../redux/profileSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axiosConfig from "../util/axios";
import { Endpoints } from "../util/apiEndpoints";
import uploadFile from "../util/uplodImage";
import Modal from "../components/Modal";
import DeleteAlert from "../components/DeleteAlert";
import Input from "../components/Input";
import {
  Pencil,
  LoaderCircle,
  LogOut,
  Trash2,
  ShieldCheck,
  User as UserIcon,
  Mail,
  Hash,
  Moon,
  Sun,
  Image as ImageIcon,
  Check,
} from "lucide-react";

const BACKGROUND_PRESETS = [
  { id: "none", label: "Default", value: "" },
  {
    id: "violet",
    label: "Violet Glow",
    value: "linear-gradient(135deg, #ede9fe 0%, #ffffff 50%, #d1fae5 100%)",
  },
  {
    id: "sunset",
    label: "Sunset",
    value: "linear-gradient(135deg, #fff7ed 0%, #ffffff 50%, #fee2e2 100%)",
  },
  {
    id: "ocean",
    label: "Ocean",
    value: "linear-gradient(135deg, #ecfeff 0%, #ffffff 50%, #e0f2fe 100%)",
  },
];

const Settings = () => {
  useUser();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const profile = useSelector((state) => state.profiles);

  const [fullName, setFullName] = useState(profile.username || "");
  const [email, setEmail] = useState(profile.email || "");
  const [photo, setPhoto] = useState(null);
  const [savingProfile, setSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark",
  );
  const [background, setBackground] = useState(
    () => localStorage.getItem("appBackground") || "",
  );
  const [customBackgroundPreview, setCustomBackgroundPreview] = useState(
    () => localStorage.getItem("appBackgroundImage") || "",
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    if (background) {
      document.body.style.backgroundImage = background;
      document.body.style.backgroundAttachment = "fixed";
    } else {
      document.body.style.backgroundImage = "";
    }
    localStorage.setItem("appBackground", background);
  }, [background]);

  function handleCustomBackgroundUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      setCustomBackgroundPreview(dataUrl);
      localStorage.setItem("appBackgroundImage", dataUrl);
      setBackground(`url(${dataUrl})`);
    };
    reader.readAsDataURL(file);
  }

  async function handleSaveProfile(e) {
    e.preventDefault();

    if (!fullName.trim()) {
      toast.error("Name is required");
      return;
    }

    setSavingProfile(true);
    try {
      let imageUrl = profile.profileImageUrl;

      if (photo) {
        imageUrl = await uploadFile(photo);
      }

      const response = await axiosConfig.put(Endpoints.UPDATE_PROFILE, {
        fullName,
        email,
        profileImageUrl: imageUrl,
      });

      dispatch(updateProfile(response.data));
      setPhoto(null);
      toast.success("Profile updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleChangePassword(e) {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    setChangingPassword(true);
    try {
      await axiosConfig.put(Endpoints.CHANGE_PASSWORD, {
        currentPassword,
        newPassword,
      });

      toast.success("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setChangingPassword(false);
    }
  }

  function handleLogout() {
    dispatch(removeProfile());
    localStorage.removeItem("token");
    toast.success("Logged out");
    navigate("/login");
  }

  async function handleDeleteAccount() {
    setDeleting(true);
    try {
      await axiosConfig.delete(Endpoints.DELETE_ACCOUNT);
      dispatch(removeProfile());
      localStorage.removeItem("token");
      toast.success("Account deleted");
      navigate("/signup");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete account");
    } finally {
      setDeleting(false);
      setOpenDeleteAlert(false);
    }
  }

  const avatarPreview = photo
    ? URL.createObjectURL(photo)
    : profile.profileImageUrl;

  return (
    <div>
      <Dashboard activeMenu={"Settings"}>
        <div className="my-5 mx-auto max-w-3xl space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Settings</h2>
            <p className="text-sm text-gray-400 mt-0.5">
              Manage your profile, appearance, and account
            </p>
          </div>

          <div className="rounded-3xl bg-gradient-to-br from-violet-50 via-white to-emerald-50 border border-violet-100 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="relative shrink-0">
                <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-violet-400 to-emerald-400">
                  <div className="w-full h-full rounded-full overflow-hidden bg-white flex items-center justify-center">
                    {avatarPreview ? (
                      <img
                        src={profile.profileImageUrl || avatarPreview}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UserIcon className="text-gray-300" size={40} />
                    )}
                  </div>
                </div>
                <label className="absolute -bottom-1 -right-1 bg-violet-600 hover:bg-violet-700 transition-colors text-white rounded-full p-2 cursor-pointer shadow-md">
                  <Pencil size={14} />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setPhoto(e.target.files[0]);
                      }
                    }}
                  />
                </label>
              </div>

              <div className="flex-1 w-full space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="flex items-center gap-2 bg-white/70 border border-violet-100 rounded-2xl px-4 py-3">
                    <UserIcon className="text-violet-400 shrink-0" size={16} />
                    <div className="min-w-0">
                      <p className="text-[11px] text-gray-400 uppercase tracking-wide">
                        Name
                      </p>
                      <p className="text-sm text-gray-800 font-medium truncate">
                        {profile.username || "—"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-white/70 border border-violet-100 rounded-2xl px-4 py-3">
                    <Mail className="text-violet-400 shrink-0" size={16} />
                    <div className="min-w-0">
                      <p className="text-[11px] text-gray-400 uppercase tracking-wide">
                        Email
                      </p>
                      <p className="text-sm text-gray-800 font-medium truncate">
                        {profile.email || "—"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-white/70 border border-violet-100 rounded-2xl px-4 py-3">
                    <Hash className="text-violet-400 shrink-0" size={16} />
                    <div className="min-w-0">
                      <p className="text-[11px] text-gray-400 uppercase tracking-wide">
                        Account ID
                      </p>
                      <p className="text-sm text-gray-800 font-medium truncate">
                        {profile.id || "—"}
                      </p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Full Name"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your full name"
                    />
                    <Input
                      label="Email"
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 transition-colors text-white font-semibold text-sm py-2.5 px-6 rounded-2xl disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {savingProfile ? (
                      <>
                        <LoaderCircle className="animate-spin" size={16} />
                        Saving
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white border border-gray-100 shadow-sm p-6 sm:p-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-5">
              Appearance
            </h3>

            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                {darkMode ? (
                  <Moon className="text-violet-500" size={18} />
                ) : (
                  <Sun className="text-amber-500" size={18} />
                )}
                <div>
                  <p className="text-sm font-medium text-gray-800">Dark Mode</p>
                  <p className="text-xs text-gray-400">
                    Switch between light and dark theme
                  </p>
                </div>
              </div>
              <button
                onClick={() => setDarkMode((prev) => !prev)}
                className={`w-12 h-7 rounded-full transition-colors relative shrink-0 ${
                  darkMode ? "bg-violet-600" : "bg-gray-200"
                }`}
              >
                <span
                  className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                    darkMode ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="pt-5">
              <div className="flex items-center gap-3 mb-4">
                <ImageIcon className="text-emerald-500" size={18} />
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    Background
                  </p>
                  <p className="text-xs text-gray-400">
                    Pick a preset or upload your own background image
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {BACKGROUND_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => {
                      setBackground(preset.value);
                      setCustomBackgroundPreview("");
                      localStorage.removeItem("appBackgroundImage");
                    }}
                    className={`relative h-16 rounded-2xl border-2 overflow-hidden flex items-end justify-center pb-1 ${
                      background === preset.value && !customBackgroundPreview
                        ? "border-violet-500"
                        : "border-gray-100"
                    }`}
                    style={{
                      background: preset.value || "#f9fafb",
                    }}
                  >
                    {background === preset.value &&
                      !customBackgroundPreview && (
                        <span className="absolute top-1 right-1 bg-violet-600 rounded-full p-0.5">
                          <Check className="text-white" size={10} />
                        </span>
                      )}
                    <span className="text-[10px] font-medium text-gray-500 bg-white/70 rounded px-1.5">
                      {preset.label}
                    </span>
                  </button>
                ))}

                <label
                  className={`relative h-16 rounded-2xl border-2 border-dashed overflow-hidden flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                    customBackgroundPreview
                      ? "border-violet-500"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  style={
                    customBackgroundPreview
                      ? {
                          backgroundImage: `url(${customBackgroundPreview})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }
                      : {}
                  }
                >
                  {!customBackgroundPreview && (
                    <>
                      <ImageIcon className="text-gray-300" size={16} />
                      <span className="text-[10px] font-medium text-gray-400">
                        Upload
                      </span>
                    </>
                  )}
                  {customBackgroundPreview && (
                    <span className="absolute top-1 right-1 bg-violet-600 rounded-full p-0.5">
                      <Check className="text-white" size={10} />
                    </span>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleCustomBackgroundUpload}
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white border border-gray-100 shadow-sm p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-5">
              <ShieldCheck className="text-emerald-500" size={20} />
              <h3 className="text-lg font-semibold text-gray-800">
                Password &amp; Security
              </h3>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <Input
                label="Current Password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="*********"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="New Password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="*********"
                />
                <Input
                  label="Confirm New Password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="*********"
                />
              </div>

              <button
                type="submit"
                disabled={changingPassword}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 transition-colors text-white font-semibold text-sm py-2.5 px-6 rounded-2xl disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {changingPassword ? (
                  <>
                    <LoaderCircle className="animate-spin" size={16} />
                    Updating
                  </>
                ) : (
                  "Update Password"
                )}
              </button>
            </form>
          </div>

          <div className="rounded-3xl bg-white border border-red-100 shadow-sm p-6 sm:p-8">
            <h3 className="text-lg font-semibold text-red-700 mb-1">
              Danger Zone
            </h3>
            <p className="text-sm text-gray-400 mb-5">
              These actions affect your account access and data
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 transition-colors text-gray-700 font-medium text-sm py-2.5 px-5 rounded-2xl"
              >
                <LogOut size={16} />
                Log Out
              </button>

              <button
                onClick={() => setOpenDeleteAlert(true)}
                className="flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 transition-colors text-red-600 font-medium text-sm py-2.5 px-5 rounded-2xl"
              >
                <Trash2 size={16} />
                Delete Account
              </button>
            </div>
          </div>

          <Modal
            isOpen={openDeleteAlert}
            onClose={() => setOpenDeleteAlert(false)}
            title="Delete Account"
          >
            <DeleteAlert
              content="This will permanently delete your account and all your data. This cannot be undone."
              onDelete={handleDeleteAccount}
              loading={deleting}
            />
          </Modal>
        </div>
      </Dashboard>
    </div>
  );
};

export default Settings;
