import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import Loader from "./Loader/Loader";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import Login from "./Login";
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteSweep } from "react-icons/md";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";


function ViewBookDetails() {
  const { id } = useParams();  // ✅ Get the book ID from URL
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ Add loading state
  // Simulate login state
  const navigate = useNavigate(); // For redirecting user
  const logIn =useSelector((state)=> state.auth.isLoggedIn);
  const role = useSelector((state) => state.auth.role);
  console.log(role)

  
  const fetchData = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/books/get-books-by-id/${id}`);
      setBook(res.data);
    } catch (error) {
      console.error("🔥 Error fetching book:", error);
    } finally {
      setLoading(false);  // ✅ Hide loader when done
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  

  if (loading) return <Loader />; // ✅ Show loader while fetching

  // 🔒 If user is not logged in, block access
  if (!logIn) {
    return (
      <div className="h-screen flex items-center justify-center bg-zinc-100">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-red-600 mb-4">Access Denied</h2>
          <p className="mb-4">You must be logged in to view this book.</p>
          <button
            onClick={() => navigate("/Signup", { state: { from: `/ViewBookDetails/${id}` } })}
            className="bg-blue-600 text-white px-6 py-2 rounded"
          >
            Go to Signup
          </button>
        </div>
      </div>
    );
  }
  
 

  if (!book) return <p className="text-red-500">❌ Book not found</p>; // ✅ Handle missing book

  const deleteBook = async () => {
    try {
      const token = localStorage.getItem("token"); // ✅ Get token
  
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/books/delete-book`, {
        headers: {
          Authorization: `Bearer ${token}`,
          bookid: id, // ✅ Use 'bookid' as per backend
        },
      });
  
      toast.success("✅ Book deleted:", response.data);
      navigate("/")
    } catch (error) {
      toast.error("❌ Failed to delete:", error.response?.data || error.message);
    }
  };
  
  
  return (
    <>
      {book ? (
          <div className="px-6 md:px-12 py-8 bg-zinc-100 flex flex-col lg:flex-row gap-8 items-start ">
            
          {/* Book Image + Actions */}
          <div className="bg-white rounded-xl shadow-lg p-6 w-full md:w-1/2 flex flex-col items-center justify-between relative">

            <div className="w-full flex justify-start">
              <button
                onClick={() => navigate(-1)}
                className="bg-zinc-700 text-white px-4 py-2 rounded hover:bg-zinc-800 transition mb-4 ml-2 mt-2"
              >
                ← Back
              </button>
            </div>    
            <div className="flex flex-col lg:flex-row gap-8">

              <img  
                src={book.image}
                alt={book.title}
                className="w-full max-h-[500px] object-contain rounded-lg"
              />
            </div>
        
            {logIn && role === "admin" && (
              
              <div className="absolute top-4 right-4 flex flex-col gap-3">
                {/* Edit/Delete Buttons */}
                <Link  to={`/update-book/${id}`}
                  className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow transition"
                  title="Edit"
                >
                  <FaRegEdit size={18} />
                </Link>
                <button
                  className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full shadow transition"
                  title="Delete" onClick={deleteBook}
                >
                  <MdDeleteSweep size={18} />
                </button>
              </div>
            )}

          </div>
        
          {/* Book Details */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            <h1 className="text-3xl font-bold text-zinc-800 mb-2">{book.title}</h1>
            <p className="text-md text-zinc-700 mb-4">{book.desc}</p>
            <p className="text-lg font-semibold text-green-700 mb-6">Price: ₹{book.price}</p>
        
            {book.file && (
              <a
                href={book.file}
                download
                className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg shadow transition"
              >
                📥 Download PDF
              </a>
            )}
          </div>
        </div>
      
      ):(
        <div className="h-screen bg-zinc-800 flex items-center justify-center">
          <Loader />
        </div>
      )}
      <Footer />
    </>
    
  );
}

export default ViewBookDetails;

