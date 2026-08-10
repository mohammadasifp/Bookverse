import React, { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./courses/Home";
import Courses from "./courses/Courses";
import Research from "./New/Research";
import Educational from "./New/Educational";
import Personality from "./New/Personality";
import Story from "./New/Story";
import About from "./home/About";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Scientific from "./Books/CS";
import EEE from "./Books/EEE";
import ME from "./Books/ME";
import MT from "./Books/MT";
import CE from "./Books/CE";
import { Toaster } from 'react-hot-toast';
import { useAuth } from "./context/AuthProvider";
import ViewBookDetails from "./components/ViewBookDetails";
import {useDispatch, useSelector} from "react-redux";
import { authActions } from "./store/auth";
import Profile from "./components/Profile"; 
import AdminProfile from "./components/AdminProfile";
import Addbook from "./components/Addbook";
import UpdateBook from "./components/UpdateBook";


function App() {
  const [authUser, setAuthUser] = useAuth();
  console.log(authUser);

  const dispatch= useDispatch();
  const role = useSelector((state)=>state.auth.role);
  useEffect(()=>{
    if (
      localStorage.getItem("id")&&
      localStorage.getItem("token")&&
      localStorage.getItem("role")
    ) {
      dispatch(authActions.Login());
      dispatch(authActions.changeRole(localStorage.getItem("role")));
    }
  })
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Course" element={<Courses />} />
        <Route path="/Research" element={authUser ?<Research /> : <Navigate to="/signup" />} />
        <Route path="/Educational" element={authUser ?<Educational />: <Navigate to="/signup" />} />
        <Route path="/Personality" element={authUser ?<Personality />: <Navigate to="/signup" />} />
        <Route path="/Story" element={authUser ?<Story />: <Navigate to="/signup" />} />
        <Route path="/About" element={<About />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/Research/Scientific" element={authUser ?<Scientific />: <Navigate to="/signup" />} />
        <Route path="/Research/EEE" element={authUser ?<EEE/>: <Navigate to="/signup" />} />
        <Route path="/Research/ME" element={authUser ?<ME/>: <Navigate to="/signup" />} />
        <Route path="/Research/MT" element={authUser ?<MT/>: <Navigate to="/signup" />} />
        <Route path="/Research/CE" element={authUser ?<CE/>: <Navigate to="/signup" />} />
        <Route path="/view-book-details/:id" element={authUser ?<ViewBookDetails/>:<Navigate to="/signup" />} />
        <Route path="/profile" element={<Profile />}>
        <Route path="add-book" element={<Addbook />} /></Route>
        <Route path="/update-book/:ids" element={<UpdateBook/>}/>
        <Route path="/AdminProfile" element={<AdminProfile />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App
