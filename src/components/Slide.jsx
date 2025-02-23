import React, { useState, useEffect, useRef } from 'react';

import logo1 from '../assets/logo1.webp';
import logo2 from '../assets/logo2.webp';
import logo3 from '../assets/logo3.webp';
import logo4 from '../assets/logo4.webp';
import logo5 from '../assets/logo5.webp';
import logo6 from '../assets/logo6.webp';
import logo7 from '../assets/logo7.png';
import logo8 from '../assets/logo8.png';
import logo9 from '../assets/logo9.webp';
import logo10 from '../assets/logo10.png';
import logo11 from '../assets/logo11.png';

const Slide = () => {
  const [isVisible, setIsVisible] = useState(false);
  const scrollRef = useRef(null);
  const logos = [logo1, logo2, logo3, logo4, logo5, logo6, logo7, logo8,logo9, logo10, logo11];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (scrollRef.current) {
      observer.observe(scrollRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const scroll = () => {
      if (scrollRef.current) {
        if (scrollRef.current.scrollLeft >= scrollRef.current.scrollWidth / 2) {
          scrollRef.current.scrollLeft = 0;
        } else {
          scrollRef.current.scrollLeft += 1;
        }
      }
    };

    const timer = setInterval(scroll, 30);
    return () => clearInterval(timer);
  }, [isVisible]);

  return (
    <div className="w-full overflow-hidden bg-black/30 backdrop-blur-sm py-8 mt-20">
      <div
        ref={scrollRef}
        className="flex items-center overflow-hidden whitespace-nowrap"
        style={{ scrollBehavior: 'smooth' }}
      >
        {/* Original logos */}
        {logos.map((logo, index) => (
          <div
            key={`logo-${index}`}
            className="mx-8 inline-block min-w-[150px] h-20"
          >
            <img
              src={logo}
              alt={`Company Logo ${index + 1}`}
              className="h-full w-full object-contain opacity-80 hover:opacity-100 transition-opacity duration-300"
              loading="lazy"
            />
          </div>
        ))}
        {/* Duplicated logos for seamless scrolling */}
        {logos.map((logo, index) => (
          <div
            key={`logo-dup-${index}`}
            className="mx-8 inline-block min-w-[150px] h-20"
          >
            <img
              src={logo}
              alt={`Company Logo ${index + 1}`}
              className="h-full w-full object-contain opacity-80 hover:opacity-100 transition-opacity duration-300"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Slide;