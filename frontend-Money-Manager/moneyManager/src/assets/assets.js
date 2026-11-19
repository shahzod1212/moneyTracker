// src/assets/assets.js

import {
  LayoutDashboard,
  Wallet,
  Receipt,
  Tags,
  Filter,
  LogIn,
  UserPlus,
  Bot,
  Trophy,
} from "lucide-react";

export const sidebarLinks = [
  {
    id: 1,
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    id: 2,
    label: "Income",
    icon: Wallet,
    path: "/income",
  },
  {
    id: 3,
    label: "Expense",
    icon: Receipt,
    path: "/expense",
  },
  {
    id: 4,
    label: "Category",
    icon: Tags,
    path: "/category",
  },
  {
    id: 5,
    label: "Filter",
    icon: Filter,
    path: "/filter",
  },
  {
    id: 6,
    label: "Invitation",
    icon: UserPlus,
    path: "/invite-team-member",
  },
  {
    id: 7,
    label: "AI Planner",
    icon: Bot,
    path: "/ai-planner",
  },
  {
    id: 8,
    label: "Goals",
    icon: Trophy,
    path: "/goals",
  },
  {
    id: 9,
    label: "Settings",
    icon: LogIn,
    path: "/settings",
  },
];
