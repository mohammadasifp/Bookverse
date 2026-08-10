import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Cards from "../components/Cards";
import list from "../../public/list.json";

function Questions() {
    return (
        <>
            <Navbar />
            <div className="mt-28 text-center">
                <h1 className="text-2xl font-semibold md:text-4xl mt-28">Research Papers</h1>
                
            </div>
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mx-auto max-w-screen-lg"> {/* Added gap and max-width */}
                {list.map((item) => (
                    <Cards key={item.id} item={item} />
                ))}
            </div>
            <Footer />
        </>
    );
}

export default Questions;
