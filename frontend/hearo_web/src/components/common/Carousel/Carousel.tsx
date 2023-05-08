import React, {useState, useEffect, useRef } from "react";
import Slider from "react-slick";
import Carousel1 from "@/assets/Carousel1.png";
import Carousel2 from "@/assets/Carousel2.png";
import Carousel3 from "@/assets/Carousel3.png";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


const images = [Carousel1, Carousel2, Carousel3]

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
    {images.map((image, index) => (
      <div key={index} className="max-w-fit">
        <div className="max-h-screen">
          <img src={image} alt={`slide=${index}`} className="border-white rounded-lg w-full h-full object-cover"/>            
        </div>
      </div>
    ))}
  </Slider>
</div>
  );
}

export default Carousel;

