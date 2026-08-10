import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { authActions } from "../store/auth"; // Adjust the path as needed
import { useAuth } from "../context/AuthProvider";


function Login() {
  const [authUser, setAuthUser] = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit =async (data) =>  {
    const userInfo = {
      email: data.email,
      password: data.password,
    };
    await axios
      .post(`${import.meta.env.VITE_API_URL}/user/login`, userInfo)
      .then((res) => {
        console.log("Login response:", res.data); // Log entire response
        setAuthUser(res.data.user); // not { user: ... }
        if (res.data.token) {
          localStorage.setItem("token", res.data.token);

          const role = res.data.user.role || "user";
          dispatch(authActions.login({ role })); // pass role here
          console.log("Token stored:", res.data.token);

          
        } else {
          console.error("No token in response!");
        }
      
        if (res.data.user?._id) {
          localStorage.setItem("id", res.data.user._id);
          localStorage.setItem("Users", JSON.stringify(res.data.user));

          const role = res.data.user.role || "user";
          dispatch(authActions.setRole(role)); // This updates role in Redux
        }
        

        toast.success("Login Successfully");
        
        document.getElementById("my_modal_3").close();
        // setTimeout(() => {
        //   window.location.reload();
        // }, 1000);
        navigate("/");
      })
      
      .catch((err) => {
        if (err.response) {
          console.log(err);
          toast.error("Error: " + err.response.data.message);
          setTimeout(() => {},2000)
        }
      });
  }

  return (
    <div>
      <dialog id="my_modal_3" className="modal">
        <div className="modal-box p-8 bg-white shadow-xl rounded-lg max-w-md">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Close button */}
            <button
              type="button"
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-gray-400 hover:text-red-600"
              onClick={() => document.getElementById("my_modal_3").close()}
            >
              ✕
            </button>
            <h3 className="font-bold text-2xl text-gray-800 mb-4">Welcome Back to Bookverse</h3>
            <p className="text-black-200 mb-6">Log in to explore the Universe of wisdom</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium">Email</label>
                <input
                  type="email"
                  placeholder="Enter Your Email"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  {...register("email", { required: true })}
                />
                {errors.email && (
                  <span className="text-red-600 text-sm">Email is required</span>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-medium">Password</label>
                <input
                  type="password"
                  placeholder="Enter Your Password"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  {...register("password", { required: true })}
                />
                {errors.password && (
                  <span className="text-red-600 text-sm">Password is required</span>
                )}
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <button
                type="submit"
                className="bg-blue-600 text-white rounded-md px-6 py-2 hover:bg-blue-800 transition-colors duration-300"
              >
                Login
              </button>
              <p className="text-sm text-gray-600">
                Not registered?{" "}
                <Link to="/Signup" className="underline text-blue-600 hover:text-blue-800">
                  Signup!
                </Link>
              </p>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
}

export default Login;
