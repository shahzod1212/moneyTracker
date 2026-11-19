import React, { useState, useEffect } from "react";
import Dashboard from "../components/Dashboard";
import Input from "../components/Input";
import {
  UserPlus,
  Mail,
  X,
  Send,
  UserCheck,
  ChevronDown,
  Users,
  Crown,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfileUsers } from "../redux/profileUsersSlice";
import { fetchProfileMembers } from "../redux/teamSlice";
import axiosConfig from "../util/axios";
import { Endpoints } from "../util/apiEndpoints";

const getInitials = (name = "") =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const InvitePage = () => {
  const dispatch = useDispatch();
  const { users, status } = useSelector((state) => state.users);
  const profile = useSelector((state) => state.profiles);
  const teamProfile = useSelector((state) => state.team?.teamProfile) || [];
  const teamId = useSelector((state) => state.team?.team?.id);

  const [userDisplay, setUserDisplay] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [hoveredMember, setHoveredMember] = useState(null);

  const isTeam = profile?.type === "TEAM";

  useEffect(() => {
    if (isTeam && teamId) {
      dispatch(fetchProfileMembers(teamId));
    }
  }, [dispatch, isTeam, teamId]);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
  };

  const handleClearSelection = () => {
    setSelectedUser(null);
  };

  const handleSendInvite = async () => {
    if (!selectedUser) return;
    setLoading(true);

    try {
      const response = await axiosConfig.post(
        Endpoints.INVITETEAMMEMBER(selectedUser.id),
      );

      if (response.status === 200) {
        alert("Invitation sent successfully!");
        setSelectedUser(null);
      }
    } catch (error) {
      console.error("Error sending invite:", error);
    } finally {
      setLoading(false);
    }
  };

  const showResults = !selectedUser;

  useEffect(() => {
    setUserDisplay(expanded ? users : users.slice(0, 5));
  }, [users, expanded]);

  const avatarGradients = [
    "from-violet-400 to-emerald-400",
    "from-amber-400 to-rose-400",
    "from-sky-400 to-indigo-400",
    "from-emerald-400 to-teal-400",
  ];

  return (
    <div>
      <Dashboard activeMenu={"Team"}>
        <div className="my-5 mx-auto max-w-3xl space-y-8">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Team</h2>
            <p className="text-sm text-gray-400 mt-0.5">
              Invite people to share and track finances together
            </p>
          </div>

          <div className="rounded-3xl bg-gradient-to-br from-violet-50 via-white to-emerald-50 border border-violet-100 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-violet-100 flex items-center justify-center shrink-0">
                <UserPlus className="text-violet-600" size={18} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">
                  Invite a member
                </p>
                <p className="text-xs text-gray-400">
                  Search by name and select who you'd like to invite
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                {selectedUser ? (
                  <div className="flex items-center gap-3 border border-violet-200 bg-white rounded-2xl px-4 py-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-400 to-emerald-400 p-0.5 shrink-0">
                      <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                        {selectedUser.profileImageUrl ? (
                          <img
                            src={selectedUser.profileImageUrl}
                            alt={selectedUser.fullName}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-[10px] font-semibold text-violet-600">
                            {getInitials(selectedUser.fullName)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {selectedUser.fullName}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {selectedUser.email}
                      </p>
                    </div>

                    <UserCheck
                      className="text-emerald-500 shrink-0"
                      size={16}
                    />

                    <button
                      onClick={handleClearSelection}
                      className="text-gray-300 hover:text-red-500 transition-colors shrink-0"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <Input
                    type="text"
                    onChange={(e) =>
                      dispatch(fetchProfileUsers(e.target.value))
                    }
                    placeholder="Search by name..."
                  />
                )}
              </div>

              <button
                onClick={handleSendInvite}
                disabled={!selectedUser || loading}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-white font-semibold text-sm py-2.5 px-6 rounded-2xl shrink-0"
              >
                <Send size={16} />
                {loading ? "Sending..." : "Send Invite"}
              </button>
            </div>

            {showResults && (
              <div className="mt-3 space-y-2">
                {status === "loading" && (
                  <p className="text-xs text-gray-400 px-1">Searching...</p>
                )}

                {status === "failed" && (
                  <p className="text-xs text-red-400 px-1">
                    Couldn't load results, try again.
                  </p>
                )}

                {status === "succeeded" && users.length === 0 && (
                  <p className="text-xs text-gray-400 px-1">
                    No matching users found
                  </p>
                )}

                {userDisplay.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => handleSelectUser(user)}
                    className="w-full flex items-center gap-3 border border-gray-100 hover:border-violet-200 hover:bg-violet-50/50 transition-colors rounded-2xl px-4 py-2.5 text-left"
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-violet-400 to-emerald-400 p-0.5 shrink-0">
                      <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                        {user.profileImageUrl ? (
                          <img
                            src={user.profileImageUrl}
                            alt={user.fullName}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-xs font-semibold text-violet-600">
                            {getInitials(user.fullName)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {user.fullName}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {user.email}
                      </p>
                    </div>

                    <Mail className="text-gray-300 shrink-0" size={14} />
                  </button>
                ))}

                {users.length > 5 && (
                  <button
                    onClick={() => setExpanded((prev) => !prev)}
                    className="w-full flex items-center gap-3 py-2 group"
                  >
                    <span className="flex-1 h-px bg-gray-100" />
                    <span className="flex items-center gap-1 text-xs font-medium text-violet-500 group-hover:text-violet-600 transition-colors">
                      {expanded ? "Show less" : "Show more"}
                      <ChevronDown
                        size={14}
                        className={`transition-transform ${expanded ? "rotate-180" : ""}`}
                      />
                    </span>
                    <span className="flex-1 h-px bg-gray-100" />
                  </button>
                )}
              </div>
            )}
          </div>

          {isTeam && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-violet-100 flex items-center justify-center">
                    <Users className="text-violet-600" size={16} />
                  </div>
                  <h3 className="text-base font-semibold text-gray-800">
                    Team Members
                  </h3>
                </div>
                <span className="text-xs font-medium text-gray-400 bg-gray-50 border border-gray-100 rounded-full px-3 py-1">
                  {teamProfile.length} / 3
                </span>
              </div>

              {teamProfile.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-gray-200 bg-gray-50/50 py-10 text-center">
                  <p className="text-sm text-gray-400">
                    No team members yet — invite someone above to get started
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {teamProfile.map((member, index) => {
                    const isHovered = hoveredMember === member.id;
                    return (
                      <div
                        key={member.id}
                        onMouseEnter={() => setHoveredMember(member.id)}
                        onMouseLeave={() => setHoveredMember(null)}
                        className={`relative overflow-hidden rounded-3xl border bg-white p-5 transition-all duration-300 ${
                          isHovered
                            ? "border-violet-200 shadow-lg shadow-violet-100/60 -translate-y-1"
                            : "border-gray-100 shadow-sm"
                        }`}
                      >
                        <div
                          className={`absolute -right-8 -top-8 w-28 h-28 rounded-full bg-gradient-to-br ${
                            avatarGradients[index % avatarGradients.length]
                          } opacity-10 transition-transform duration-500 ${
                            isHovered ? "scale-125" : "scale-100"
                          }`}
                        />

                        <div className="relative flex items-center gap-4">
                          <div
                            className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${
                              avatarGradients[index % avatarGradients.length]
                            } p-0.5 shrink-0 transition-transform duration-300 ${
                              isHovered ? "scale-105 rotate-3" : ""
                            }`}
                          >
                            <div className="w-full h-full rounded-2xl bg-white flex items-center justify-center overflow-hidden">
                              {member.profileImageUrl ? (
                                <img
                                  src={member.profileImageUrl}
                                  alt={member.fullName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="text-sm font-bold text-gray-700">
                                  {getInitials(member.fullName)}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <p className="text-sm font-semibold text-gray-800 truncate">
                                {member.fullName}
                              </p>
                              {member.id === profile?.id && (
                                <Crown
                                  size={12}
                                  className="text-amber-500 shrink-0"
                                />
                              )}
                            </div>
                            <p className="text-xs text-gray-400 truncate mt-0.5">
                              {member.email}
                            </p>

                            <div className="flex items-center gap-1.5 mt-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                              <span className="text-[11px] font-medium text-emerald-600">
                                Active member
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </Dashboard>
    </div>
  );
};

export default InvitePage;
