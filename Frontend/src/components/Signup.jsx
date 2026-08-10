import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Login from "./Login";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import Home from "../courses/Home";
function Signup() {
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/";
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const API_URL = import.meta.env.VITE_API_URL;
  // Watching the password field to compare with confirmPassword
  const password = watch("password");

  const onSubmit = async (data) => {
    const userInfo = {
      fullname: data.fullname,
      email: data.email,
      password: data.password,
    };
    await axios
      .post(`${API_URL}/user/signup`, userInfo)
      .then((res) => {
        console.log(res.data);
        if (res.data) {
          toast.success("Signup Successfully");
          navigate(from, { replace: true });
          
        }
        localStorage.setItem("Users", JSON.stringify(res.data.user));
      })
      .catch((err) => {
        if (err.response) {
          console.log(err);
          toast.error("Error: " + err.response.data.message);
        }
      });
  }
  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="border-2 shadow-lg p-6 rounded-lg bg-white max-w-md">
        <h3 className="font-bold text-xl text-center text-gray-800">Welcome to Bookverse</h3>
        <p className="py-2 text-center text-gray-600">Create your account and enter the universe of wisdom</p>

        {/* Correctly use form and onSubmit */}
        <form onSubmit={handleSubmit(onSubmit)}>

        <div className="mt-4">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              placeholder="Enter Your Full Name"
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register("fullname", {
                required: true,
                
              })}
            />
            {errors.fullname && (
              <span className="text-red-600 text-sm">{errors.text.message}</span>
            )}
          </div>

          <div className="mt-6">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              placeholder="Enter Your Email"
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <span className="text-red-600 text-sm">{errors.email.message}</span>
            )}
          </div>

          <div className="mt-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              placeholder="Enter Your Password"
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && (
              <span className="text-red-600 text-sm">{errors.password.message}</span>
            )}
          </div>

          

          <div className="flex justify-between items-center mt-6">
            <button type="submit" className="bg-blue-700 text-white py-2 px-4 rounded-lg hover:bg-blue-800 transition duration-300">
              Signup
            </button>
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <button
                type="button"
                className="underline text-blue-700 hover:text-blue-900"
                onClick={() => document.getElementById("my_modal_3").showModal()}
              >
                Login!
              </button>
            </p>
          </div>
        </form>
      </div>

      <Login />
    </div>
  );
}

export default Signup;
