import React, { useEffect, useState } from "react";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import CS from "../../public/CS.json"
import EEE from "../../public/EEE.json"
import ME from "../Books/ME";
import MT from "../Books/MT";
import CE from "../Books/CE"
import Cards from "./Cards";
import list from "../../public/CS.json";
import { Link } from "react-router-dom";
import axios from "axios";
import Loader from "./Loader/Loader";


function FreeBook(){
  const [book,setBook]=useState([])
    useEffect(() =>{
        const getBook=async()=>{
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/books`);
                const data=res.data.filter((data)=>data.category==="Free"|| 0<1)
                console.log(data)
                setBook(data)
            } catch (error) {
                console.log(error)
            }
        };
        getBook();
    },[])
    
    var settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 3,
        initialSlide: 0,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 3,
              infinite: true,
              dots: true
            }
          },
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2,
              initialSlide: 2
            }
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1
            }
          }
        ]
      };
    // console.log(filterData)
    return (
        <>
        <div className="max-w-screen-2x1 container mx-auto md:px-20 px-4">
            <h1 className="font-bold text-xl pb-2 text-blue-700">Free Offered Research papers</h1>
            <p className="text-xl pb-2">We offer you free research papers for every student in every branch choose your branch and explore 
              the world of free research papers
            </p>
        </div>
        
        <div className="max-w-screen-2xl container mx-auto md:px-20 px-4">
          <div>
            {book.length === 0 ? (
              <div className="flex items-center justify-center my-8">
                <Loader /> 
              </div>
            ) : (
              <Slider {...settings}>
                {book.map((item) => (
                  <Cards item={item} key={item._id || item.id} />
                ))}
              </Slider>
            )}
          </div>
        </div>
        </>
    );
}

export default FreeBook