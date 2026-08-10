import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Cards from "../components/Cards";
import list from "../../public/Paid.json";
import { useNavigate } from "react-router-dom"; // For navigation

function Educational() {
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Simulate login state
    const navigate = useNavigate(); // For redirecting user

    // Function to handle book click
    const handleBookClick = (item) => {
        if (!isLoggedIn) {
            // If user is not logged in, redirect to login page
            alert("Please login to access paid books.");
            navigate("/Login", { state: { from: '/Educational' } }); // Pass the current page for redirection after login
        } else {
            // If user is logged in, proceed to book download/purchase
            window.open(item.link, "_blank"); // Assuming item.link is the book link
        }
    };

    return (
        <>
            <Navbar />
            <div className="mt-28 items-center justify-center text-center">
                <h1 className="text-2xl font-semibold md:text-4xl items-center justify-center text-center mt-28">Tech Books Written by Famous Technologists</h1>
            </div>
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mx-auto max-w-screen-lg">
                {list.map((item) => (
                    <div key={item.id} onClick={() => handleBookClick(item)}>
                        <Cards item={item} />
                    </div>
                ))}
            </div>
            <Footer />
        </>
    );
}

export default Educational;
