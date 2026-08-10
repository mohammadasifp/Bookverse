import React from "react";
import Navbar from "../components/Navbar";
import Banner from "../components/Banner";
import FreeBook from "../components/FreeBook";
import Footer from "../components/Footer";
import Login from "../components/Login";


function Home() {
    return (
        <>
            <Navbar />
            <Banner />
            <FreeBook />
            <Login /> {/* This will render the Login modal */}
            <Footer />
        </>
    );
}

export default Home;
