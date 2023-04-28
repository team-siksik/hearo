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
    slidesToShow: 4,
    slidesToScroll: 1,
    draggable: true,
    touchMove: true,
  };

  const arrowRef = useRef(null);

  return (
    <div>
      <Slider ref={arrowRef} {...settings}>
        {images.map((image, index) => (
          <div key={index}>
            <img
              src={image}
              alt={`slide${index}`}
              className="rounded-md"
            />
          </div>
        ))}
      </Slider>

    </div>
  );
}

export default Carousel;

