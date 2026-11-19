export const BASE_URL = "http://localhost:8080";

export const CLOUDINARY = "drmwjjzea";

export const Endpoints = {
  LOGIN: "/api/profiles/login",
  SIGNUP: "/api/profiles/register",
  GETPROFILE: "/api/profiles/profile",
  ACTIVATEPROFILE: (token) => `/api/profiles/activate?token=${token}`,
  SEARCHBYNAME: (keyword) => `/api/profiles/search-name?keyword=${keyword}`,

  GETALLCATEGORIES: "/api/categories",
  ADDCATEGORY: "/api/categories",
  UPDATECATEGORY: (id) => `/api/categories/${id}`,
  CATEGORIESBYTYPE: (type) => `/api/categories/${type}`,

  GETINCOMES: "/api/incomes",
  ADDINCOME: "/api/incomes",
  DELETEINCOME: (id) => `/api/incomes/${id}`,

  GETEXPENSES: "/api/expenses",
  ADDEXPENSE: "/api/expenses",
  DELETEEXPENSE: (id) => `/api/expenses/${id}`,

  FILTER: "/api/filter",
  DASHBOARDDATA: "/api/dashboard",

  INVITETEAMMEMBER: (profileId) => `/api/teams/invite/${profileId}`,
  ACCEPTTEAMINVITATION: (ownerId) => `/api/teams/accept?ownerId=${ownerId}`,
  GETTEAMINCOMES: (teamId) => `/api/teams/${teamId}/incomes`,
  GETTEAMEXPENSES: (teamId) => `/api/teams/${teamId}/expenses`,
  GETTEAMMEMBERS: (teamId) => `/api/teams/${teamId}/members`,
  TEAMDASHBOARDDATA: (teamId) => `/api/dashboard/team/${teamId}`,

  CREATEGOAL: "/api/goals",
  GETALLGOALS: "/api/goals",
  GETGOALBYID: (goalId) => `/api/goals/${goalId}`,
  GETGOALSBYPROFILE: (profileId) => `/api/goals/profile/${profileId}`,
  UPDATEGOAL: (goalId) => `/api/goals/${goalId}`,
  UPDATEGOALCURRENTAMOUNT: "/api/goals/current-amount",
  COMPLETEGOAL: (goalId) => `/api/goals/${goalId}/complete`,
  CANCELGOAL: (goalId) => `/api/goals/${goalId}/cancel`,
  REOPENGOAL: (goalId) => `/api/goals/${goalId}/reopen`,
  DELETEGOAL: (goalId) => `/api/goals/${goalId}`,

  ASKAI: "/api/ai/ask",

  UPLOAD_IMAGE: `https://api.cloudinary.com/v1_1/${CLOUDINARY}/image/upload`,
};
