import React, { useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import axiosConfig from "../util/axios";
import { Endpoints } from "../util/apiEndpoints";

const useUser = () => {
  const { user, setUser } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      return;
    }
    let isMouted = true;

    async function fetchProfile() {
      try {
        const response = await axiosConfig.get(Endpoints.GETPROFILE);

        if (isMouted && response.data) {
          setUser(response.data);
        }
      } catch (error) {
        console.log("Failed to get the profiel", error);
        if (isMouted) {
          setUser(null);
          navigate("/login");
        }
      }
    }

    fetchProfile();
    return () => {
      isMouted = false;
    };
  }, [setUser, navigate]);
};

export default useUser;
