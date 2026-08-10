import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Profile/Sidebar";
import { Outlet } from "react-router-dom";
import axios from "axios";
import Loader from "./Loader/Loader";
import Footer from "../components/Footer";
import Addbook from "./Addbook";

const Profile = () => {
  const [profile, setProfile] = useState();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const id = localStorage.getItem("id");

        if (!token || !id) {
          console.error("❌ Token or ID missing in localStorage.");
          return;
        }

        const headers = {
          id: id,
          Authorization: `Bearer ${token}`,
        };

        console.log("🧾 Headers:", headers);

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/user/get-user-information`,
          { headers }
        );

        console.log("✅ Profile fetched:", response.data);
        setProfile(response.data);
      } catch (err) {
        console.error("❌ Failed to fetch user data:", err.response?.data || err.message);
      }
    };

    fetchProfile();
  }, []);

  return (
    <>
      <Navbar/>
      <div className="bg-zinc-10 px-12 flex flex-col md:flex-row h-screen py-8 gap-4 text-white min-h-screen">
        {!profile ? (
          <div className="w-full h-full flex items-center justify-center">
            <Loader />
          </div>
        ) : (
          <>
            <div className="w-auto  md:w-2/6 mt-28 text-center px-4 ">
              <Sidebar data={profile}/>
            </div>
            
            <div className="flex-1 p-5 w-full h-full overflow-auto bg-zinc-50">
              <Outlet />
            </div>
          </>
        )}
      </div>
      <Footer/>
    </>
    
  );
};

export default Profile;
