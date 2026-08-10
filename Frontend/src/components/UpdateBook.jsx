import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

function UpdateBook() {
    const { ids } = useParams();
    const navigate = useNavigate();
    const [Data, setData] = useState({
      name: "",
      price: "",
      category: "",
      image: null,
      title: "",
      desc: "",
      file: null,
    });
  
    const id = localStorage.getItem("id");
    const token = localStorage.getItem("token");
  
    const change = (e) => {
      const { name, value, files } = e.target;
      if (files) {
        setData({ ...Data, [name]: files[0] });
      } else {
        setData({ ...Data, [name]: value });
      }
    };
  
    const submit = async () => {
      if (
        !Data.name ||
        !Data.price ||
        !Data.category ||
        !Data.image ||
        !Data.title ||
        !Data.desc ||
        !Data.file
      ) {
        toast.error("All fields are required!");
        return;
      }
  
      try {
        const formData = new FormData();
        formData.append("name", Data.name);
        formData.append("price", Data.price);
        formData.append("category", Data.category);
        formData.append("image", Data.image);
        formData.append("title", Data.title);
        formData.append("desc", Data.desc);
        formData.append("file", Data.file);
  
        const response = await axios.put(
          `${import.meta.env.VITE_API_URL}/books/update-book`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              id: id,
              Authorization: `Bearer ${token}`,
              bookid: ids,
            },
          }
        );
        console.log(response)
        toast.success("Book is updated successfully!");
        navigate(`/view-book-details/${ids}`)
        setData({
          name: "",
          price: "",
          category: "",
          image: null,
          title: "",
          desc: "",
          file: null,
        });
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to update book");
       
      }
    };
    useEffect(() => {
      const fetchData = async () => {
        try {
          const res = await axios.get(`${import.meta.env.VITE_API_URL}/books/get-books-by-id/${ids}`);
          setData(res.data);
        } catch (error) {
          console.error("🔥 Error fetching book:", error);
        }
      };
  
      fetchData();
    }, [ids]);
    
  
    return (
      <div className="w-full h-[100%] md:h-[100%] bg-gradient-to-br from-zinc-400 via-zinc-900 to-black p-6 lg:p-12 overflow-y-auto">
        <div className="p-4 w-full bg-gradient-to-br from-zinc-700 to-black rounded shadow-lg text-white">
          <button
            onClick={() => navigate(-1)}
            className="bg-zinc-700 text-white px-4 py-2 rounded hover:bg-zinc-800 transition mb-2 ml-2 mt-2"
          >
            ← Back
          </button>
  
          <h1 className="text-4xl font-bold text-blue-400 mt-0 mb-6 flex items-center gap-2 justify-center">
            📚 Update Book
          </h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label className="text-white font-medium">Book Name</label>
            <input
              type="text"
              name="name"
              value={Data.name}
              onChange={change}
              placeholder="Enter book name"
              className="w-full mt-2 bg-zinc-700 text-white p-3 rounded-lg border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
  
          {/* Price */}
          <div>
            <label className="text-white font-medium">Price</label>
            <input
              type="number"
              name="price"
              value={Data.price}
              onChange={change}
              placeholder="Enter price"
              className="w-full mt-2 bg-zinc-700 text-white p-3 rounded-lg border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
  
          {/* Category */}
          <div>
            <label className="text-white font-medium">Category</label>
            <input
              type="text"
              name="category"
              value={Data.category}
              onChange={change}
              placeholder="e.g., Science, Fiction"
              className="w-full mt-2 bg-zinc-700 text-white p-3 rounded-lg border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
  
          {/* Image */}
          <div>
            <label className="text-white font-medium">Cover Image</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={change}
              className="w-full mt-2 bg-zinc-700 text-white p-3 rounded-lg border border-zinc-600 focus:outline-none file:cursor-pointer file:bg-zinc-600 file:border-none file:px-4"
            />
          </div>
  
          {/* Title */}
          <div>
            <label className="text-white font-medium">Title</label>
            <input
              type="text"
              name="title"
              value={Data.title}
              onChange={change}
              placeholder="Short title"
              className="w-full mt-2 bg-zinc-700 text-white p-3 rounded-lg border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
  
          {/* Description */}
          <div>
            <label className="text-white font-medium">Description</label>
            <textarea
              type="text"
              rows="10"
              name="desc"
              value={Data.desc}
              onChange={change}
              placeholder="Brief description"
              className="w-full mt-2 bg-zinc-700 text-white p-3 rounded-lg border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
  
          {/* File */}
          <div className="md:col-span-2">
            <label className="text-white font-medium">Upload Book File</label>
            <input
              type="file"
              name="file"
              accept=".pdf,.epub"
              onChange={change}
              className="w-full mt-2 bg-zinc-700 text-white p-3 rounded-lg border border-zinc-600 focus:outline-none file:cursor-pointer file:bg-zinc-600 file:border-none file:px-4"
            />
          </div>
        </div>
  
        {/* Submit Button */}
        <div className="mt-10 text-center">
          <button
            onClick={submit}
            className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl transition duration-300 shadow-lg"
          >
            🚀 Update Book
          </button>
        </div>
      </div>
    );
}

export default UpdateBook