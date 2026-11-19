import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Users, CheckCircle2, Mail, Loader2, AlertCircle } from "lucide-react";
import { useDispatch } from "react-redux";
import axiosConfig from "../util/axios";
import { Endpoints } from "../util/apiEndpoints";
import { updateProfile } from "../redux/profileSlice";
import { setTeam } from "../redux/teamSlice";

const AcceptingInvitation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const ownerId = searchParams.get("ownerId");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleAcceptInvitation() {
    if (!ownerId) {
      setError("This invitation link is missing required information.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axiosConfig.post(
        Endpoints.ACCEPTTEAMINVITATION(ownerId),
      );

      if (response.status === 200) {
        const profileResponse = await axiosConfig.get(Endpoints.GETPROFILE);
        dispatch(updateProfile(profileResponse.data));
        dispatch(setTeam(response.data));
        navigate("/dashboard");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "This invitation link is invalid or has expired.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full rounded-3xl bg-gradient-to-br from-violet-50 via-white to-emerald-50 border border-violet-100 shadow-sm p-8 text-center">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-violet-100 flex items-center justify-center mb-6">
          <Mail className="text-violet-600" size={28} />
        </div>

        <h2 className="text-xl font-semibold text-gray-800">
          You've been invited!
        </h2>
        <p className="text-sm text-gray-400 mt-2 leading-relaxed">
          Join the team to share and track finances together
        </p>

        <div className="flex items-center justify-center gap-3 mt-6 mb-8 bg-white/70 border border-violet-100 rounded-2xl px-4 py-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-violet-400 to-emerald-400 p-0.5 shrink-0">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-xs font-semibold text-violet-600">
              <Users size={16} />
            </div>
          </div>
          <div className="min-w-0 text-left">
            <p className="text-sm font-medium text-gray-800 truncate">
              Team Owner
            </p>
            <p className="text-xs text-gray-400 truncate">
              invited you to their team
            </p>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 mb-5 text-left bg-red-50 border border-red-100 text-red-500 text-xs font-medium px-4 py-2.5 rounded-2xl">
            <AlertCircle size={14} className="shrink-0" />
            {error}
          </div>
        )}

        <div className="flex flex-col gap-3">
          <button
            onClick={handleAcceptInvitation}
            disabled={loading}
            className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-white font-semibold text-sm py-2.5 px-6 rounded-2xl"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <CheckCircle2 size={16} />
            )}
            {loading ? "Accepting..." : "Accept Invitation"}
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            disabled={loading}
            className="flex items-center justify-center gap-2 w-full bg-white hover:bg-gray-50 border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-gray-600 font-semibold text-sm py-2.5 px-6 rounded-2xl"
          >
            <Users size={16} />
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default AcceptingInvitation;
