import React from "react";
import { useAuth } from "../context/AuthProvider";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authActions } from "../store/auth";

function Logout() {
  const [authUser, setAuthUser] = useAuth();
  const dispatch = useDispatch()
  const navigate= useNavigate();
  const handleLogout = () => {
    try {
      setAuthUser({
        ...authUser,
        user: null,
      });
      dispatch(authActions.logout());
      dispatch(authActions.changeRole("user"));
      localStorage.removeItem("id");
      localStorage.removeItem("token");
      localStorage.removeItem("role");

      localStorage.removeItem("Users");
      toast.success("Logout successfully");
      navigate("/")

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      toast.error("Error: " + error);
      setTimeout(() => {}, 2000);
    }
  };
  return (
    <div>
      <button
        className="px-3 py-2 bg-red-500 text-white rounded-md cursor-pointer"
        onClick={handleLogout}
        
      >
        Logout
      </button>
    </div>
  );
}

export default Logout;