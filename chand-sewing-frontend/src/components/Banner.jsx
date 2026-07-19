import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Banner.css";

const SLIDES = [
 {
    title: "Multi-Head Embroidery Machines",
    subtitle: "Precision stitching for professional studios",
    image:
      "https://th.bing.com/th/id/OIP.BPpSexOr3JqpA0BrkbdWAQHaE8?w=259&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
  },
  {
    title: "Industrial Sewing Machines",
    subtitle: "Built for high-volume tailoring units",
    image:
      "https://th.bing.com/th/id/OIP.27NVJvhfU_p2HiyWjiC35wHaE2?w=303&h=199&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
  },
  {
    title: "Genuine Spare Parts & Accessories",
    subtitle: "Keep every machine running smoothly",
    image:
      "https://tse3.mm.bing.net/th/id/OIP.CunA1-jbzrAZqN_jfJEN6wHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
  },
];
function Arrow({ className, onClick, children }) {
  return (
    <button className={`csm-banner-arrow ${className}`} onClick={onClick}>
      {children}
    </button>
  );
}

export default function Banner() {
  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 4000,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: <Arrow className="prev">‹</Arrow>,
    nextArrow: <Arrow className="next">›</Arrow>,
  };

  return (
    <div className="csm-banner">
      <Slider {...settings}>
        {SLIDES.map((slide, i) => (
          <div key={i} className="csm-banner-slide">
            <img src={slide.image} alt={slide.title} />
            <div className="csm-banner-caption">
              <h2>{slide.title}</h2>
              <p>{slide.subtitle}</p>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}
