import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Cards({ item }) {
  const [book, setBook] = useState(item);

  useEffect(() => {
    const fetchUpdatedBook = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/books/get-books-by-id/${item._id || item.id}`);
        setBook(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch updated book data:", err);
      }
    };

    fetchUpdatedBook();
  }, [item._id, item.id]);

  return (
    <Link to={`/view-book-details/${book._id || book.id}`}>
      <div className="mt-4 my-3 p-3">
        <div className="card bg-base-100 w-92 shadow-xl h-full hover:scale-105 duration-200">
          {/* Image Section */}
          <figure className="p-2">
            <img
              src={book.image ? book.image : "/fallback-image.jpg"}
              alt={book.title}
              className="w-full h-auto object-cover rounded-lg"
            />
          </figure>

          <div className="card-body min-h-[200px] flex flex-col justify-between">
            <h2 className="card-title">
              {book.title}
              <div className="badge badge-secondary bg-blue-700 border-blue-700">NEW</div>
            </h2>
            <p>Price: ₹{book.price}</p>
            <div className="card-actions justify-between cursor-pointer">
              <div className="badge badge-outline hover:bg-blue-700 hover:text-white duration-200">
                {book.category}
              </div>
              <div className="badge badge-outline hover:bg-blue-700 hover:text-white duration-200">
                Buy
              </div>

              {/* {book.file && (
                <a href={book.file} download className="btn btn-primary">
                  📥 Download
                </a>
              )} */}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default Cards;
