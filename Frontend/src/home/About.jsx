import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function About() {
    return (
        <>
            <Navbar />
            <div className="mt-28 text-center px-4">
                <h1 className="text-2xl font-semibold md:text-4xl mt-28">About Bookverse</h1>
                <p className="mt-12 text-lg font-medium md:text-xl">
                    Welcome to Bookverse, where every book opens a new universe. We are a team of four students passionate about creating a platform that benefits students like us.
                </p>
                <p className="mt-4 text-lg font-medium md:text-xl">
                    Bookverse is a student-driven initiative aimed at offering a wide range of academic resources. We provide free access to research papers, records, and question papers, while offering paid resources in personality development and tech books, specifically designed to enhance both academic and personal growth.
                </p>
                <div className="mt-8 text-lg font-medium md:text-xl">
                    <h2 className="text-xl font-semibold">Our Team:</h2>
                    <ul className="list-disc list-inside mt-2">
                        <li><strong>Frontend:</strong> Rohan Robert, Ajay T</li>
                        <li><strong>Backend:</strong> Mohammad Asif P, Mohammad Khaleel</li>
                    </ul>
                </div>
                <div className="mt-8 text-lg font-medium md:text-xl">
                    <p>
                        We are currently pursuing a diploma in Computer Science and Engineering. The idea for Bookverse started when I, Rohan Robert, wanted to create something meaningful for students. After sharing the concept with my friends, we began planning and developing Bookverse to help fellow students access a wide range of learning materials.
                    </p>
                </div>
                <div className="mt-8 text-lg font-medium md:text-xl">
                    <h2 className="text-xl font-semibold">Our Mission:</h2>
                    <p>To empower students by providing them with valuable educational resources, fostering both academic and personal development.</p>
                </div>
                <div className="mt-8 text-lg font-medium md:text-xl">
                    <h2 className="text-xl font-semibold">What We Offer:</h2>
                    <ul className="list-disc list-inside mt-2">
                        <li><strong>Free:</strong> Research papers, records, and question papers</li>
                        <li><strong>Paid:</strong> Personality development and tech books</li>
                    </ul>
                </div>
                <p className="mt-8 text-lg font-medium md:text-xl">
                    Our target audience is students who are eager to learn and grow, and Bookverse is designed to make their academic journey smoother and more enriching.
                </p>
            </div>
            <Footer />
        </>
    );
}

export default About;
