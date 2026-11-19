import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import Income from "./pages/Income";
import Expense from "./pages/Expense";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Category from "./pages/Category";
import Filter from "./pages/Filter";
import Settings from "./components/Settings";
import useHydrateRedux from "./hooks/useHydrateRedux";
import InvitePage from "./components/InvitePage";
import AcceptingInvitation from "./pages/AcceptingInvitation";
import AiPlanner from "./pages/AiPLanner";
import Goals from "./pages/Goals";

const App = () => {
  useHydrateRedux();
  return (
    <div>
      <Routes>
        <Route path="/" element={<Root />} />
        <Route path="/dashboard" element={<Home />} />
        <Route path="/income" element={<Income />} />
        <Route path="/expense" element={<Expense />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/category" element={<Category />} />
        <Route path="/filter" element={<Filter />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/invite-team-member" element={<InvitePage />} />
        <Route path="/accept-invitation" element={<AcceptingInvitation />} />
        <Route path="/ai-planner" element={<AiPlanner />} />
        <Route path="/goals" element={<Goals />} />
      </Routes>

      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

const Root = () => {
  const isAuthenticated = !localStorage.getItem("token");

  return isAuthenticated ? (
    <Navigate to="/dashboard" />
  ) : (
    <Navigate to="/login" />
  );
};
export default App;
