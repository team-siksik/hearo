import React, {useState, useEffect, useRef } from "react";
import Slider from "react-slick";
import Test1 from "@/assets/carousel1.jpg"
import Test2 from "@/assets/carousel2.jpg"
import Test3 from "@/assets/carousel3.jpg"
import Test4 from "@/assets/carousel4.jpg"
import Test5 from "@/assets/carousel5.jpg"
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


const images = [Test1, Test2, Test3, Test4,Test5]

function Carousel() {
  const [sliderRef, setSliderRef] = useState<Slider | null>(null);

  const settings = {
    // 아래 점
    arrows:true,
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 0,
    autoplay: true,
    autoplaySpeed: 5000,
  };  

  return (
    <div className="object-fill">
      <Slider {...settings}  ref={(slider) => setSliderRef(slider)}>
        {images.map((images, index) => (
          <div key={index} className="w-full max-w-fit">
            <img src={images} alt={`slide=${index}`} className="border-white rounded-md w-full max-h-56"/>            
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default Carousel;

