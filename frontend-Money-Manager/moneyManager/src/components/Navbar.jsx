import React, {
  useContext,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
} from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { LogOut, Menu, User, X } from "lucide-react";
import Sidebar from "./Sidebar";
import { getUser } from "../indexeddb/indexeddb";

const Navbar = ({ activeMenu }) => {
  const [openNavbar, setOpenNavbar] = useState(false);
  const [dropdown, setDropDown] = useState(false);
  const dropdownRef = useRef(null);
  const { user, setUser } = useContext(AppContext);
  const [dbUser, setDbUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    getUser((data) => {
      setDbUser(data?.[0]);
    });
  }, []);

  function handleLogOut() {
    localStorage.clear();
    setDropDown(false);
    navigate("/login");
    setUser(null);
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropDown(false);
      }
    }

    if (dropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdown]);
  return (
    <div className="flex items-center justify-between gap-5 bg-white  border-b-1 border-gray-200/50 backdrop-blur-[2px] py-4 px-4 sm:px-7 sticky top-0 z-50">
      <div className="flex items-center gap-5">
        <button
          onClick={() => setOpenNavbar(!openNavbar)}
          className="block lg:hidden text-block hover:bg-gray-100 py-1 rounded transition-colors"
        >
          {openNavbar ? (
            <X className="text-2xl" />
          ) : (
            <Menu className="text-2xl" />
          )}
        </button>
        <div className="flex items-center gap-2">
          <img src="logo.png" alt="" className="h-10 w-10" />
          <span className="text-lg  font-bold truncate group  text-black">
            Money{" "}
            <span className="bg-gradient-to-b from-purple-500 group-hover:text-black to-purple-950 bg-clip-text text-transparent">
              Manager
            </span>
          </span>
        </div>
      </div>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropDown(!dropdown)}
          className="flex items-center justify-center w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full overflow-hidden transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-800 focus:ring-offset-2"
        >
          {user?.profileImageUrl ? (
            <img
              src={user.profileImageUrl}
              alt={user.fullName}
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <User className="text-purple-500" />
          )}
        </button>

        {dropdown && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-55 ">
            <div className="px-4 py-3 border-b borer-gray-100 ">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full overflow-hidden shrink-0">
                  {user?.profileImageUrl ? (
                    <img
                      src={user.profileImageUrl}
                      alt={user.fullName}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <User className="w-4 h-4 text-purple-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800  truncate">
                    {user.fullName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
              </div>
            </div>
            <div className="py-1 group">
              <button
                onClick={handleLogOut}
                className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-300"
              >
                <LogOut className="w-4 h-4 text-gray-500" />
                <span className="group-hover:text-red-600">Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {openNavbar && (
        <div className="fixed  left-0 right-0 bg-white border-b border-gray-200 lg:hidden z-20 top-[73px]">
          <Sidebar activeMenu={activeMenu} />
        </div>
      )}
    </div>
  );
};

export default Navbar;
