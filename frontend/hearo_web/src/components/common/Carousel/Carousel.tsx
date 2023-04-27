import React, {useState, useEffect, useRef } from "react";
import Slider from "react-slick";
import Test1 from "@/assets/carousel1.jpg"
import Test2 from "@/assets/carousel2.jpg"
import Test3 from "@/assets/carousel3.jpg"
import Test4 from "@/assets/carousel4.jpg"
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/solid";

const images = [Test1, Test2, Test3, Test4]

function Carousel() {
  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    draggable: true,
    touchMove: true,
    initialSlide: 1,
  };

  const arrowRef = useRef(null);

  return (
    <div className="relative">
      <Slider ref={arrowRef} {...settings}>
        {images.map((image, index) => (
          <div key={index}>
            <img
              src={image}
              alt={`slide${index}`}
              className="h-72 w-full object-cover object-center rounded-md"
            />
          </div>
        ))}
      </Slider>

      <div className="bottom-4 left-4 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            className="w-2 h-2 rounded-full border-2 border-white focus:outline-none"
          />
        ))}
      </div>
    </div>
  );
}

export default Carousel;

