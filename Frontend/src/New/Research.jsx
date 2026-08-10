import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Research() {
    return (
        <>
            <Navbar />
            <div className="mt-28 text-center">
                <h1 className="text-2xl font-semibold md:text-4xl mt-28">Research Papers</h1>
                <h2 className="text-xl font-semibold md:text-2xl mt-8">Kindly select your respective field</h2>
            </div>
            <div className="max-w-screen-2x1 container mx-auto md:px-20 px-4">
                {/* Add Link to navigate to the Scientific component */}
                <h3 className="text-lg font-semibold text-blue-700 underline cursor-pointer text-center">
                    <Link to="/research/scientific">Computer Science</Link>
                </h3>
                <h3 className="text-lg font-semibold text-blue-700 underline cursor-pointer text-center">
                    <Link to="/research/EEE">Electrical and Electronical Engineering</Link>
                </h3>
                <h3 className="text-lg font-semibold text-blue-700 underline cursor-pointer text-center">
                    <Link to="/research/ME">Mechanical Engineering</Link>
                </h3>
                <h3 className="text-lg font-semibold text-blue-700 underline cursor-pointer text-center">
                    <Link to="/research/MT">Metallurgical Engineering</Link>
                </h3>
                <h3 className="text-lg font-semibold text-blue-700 underline cursor-pointer text-center">
                    <Link to="/research/CE">Civil Engineering</Link>
                </h3>
            </div>
            <Footer />
        </>
    );
}

export default Research;
