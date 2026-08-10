import { useContext } from "react";
import { AuthContext } from "../../context/AuthProvider";
import Logout from "../Logout";
import {useDispatch} from "react-redux";
import {authActions} from "../../store/auth"
import { Link, useNavigate } from "react-router-dom";

export default function Sidebar({ data }) {
  const { Logout } = useContext(AuthContext);
  const dispatch = useDispatch()
  const navigate= useNavigate();

  return (
    <div className="bg-zinc-100 p-6 rounded-lg flex flex-col text-black shadow-lg item-center h-full justify-between h-[100%]">
      <div>
        <h2 className="text-xl font-semibold mb-4">Welcome, {data.fullname || "User"} 👋</h2>
        <p><strong>Email:</strong> {data.email}</p>
        <p><strong>Role:</strong> {data.role || "Reader"}</p>
      </div>
      {data.role === "admin" && (<div className="bg-zinc-400 w-full flex-col item-center justify-center hidden lg:flex">
        <Link to='/profile/add-book' className="text-zinc-100 font-semibold w-full py-2 text-center hover:bg-zinc-900 rounded transition-auto">
          Add Book
        </Link>
        
        </div>
      )}
      <div className='mt-6 justify-end'>
        <button
          className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition duration-300" 
          onClick={()=>{
            dispatch(authActions.logout());
            dispatch(authActions.changeRole("user"));
            localStorage.clear("id");
            localStorage.clear("token");
            localStorage.clear("role");
            navigate("/")
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
