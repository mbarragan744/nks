import React, { useEffect, useState, useRef, Suspense } from 'react';
import Slider from 'react-slick';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export default function HeroSection() {
  const [heroImages, setHeroImages] = useState([]);
  const sliderRef = useRef(null);
  const [firstImageLoaded, setFirstImageLoaded] = useState(false);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'hero'));
        const images = querySnapshot.docs.map((doc) => doc.data().url);
        setHeroImages(images);
        preloadImages(images);
        addPreloadLinks(images);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };
    fetchImages();
  }, []);

  const preloadImages = (images) => {
    const promises = images.map((src, index) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
          if (index === 0) setFirstImageLoaded(true);
          resolve();
        };
        img.onerror = resolve;
      });
    });

    Promise.all(promises).then(() => {
      setFirstImageLoaded(true);
    });
  };

  const addPreloadLinks = (images) => {
    images.forEach((image, index) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = image;
      link.as = 'image';
      link.fetchpriority = index === 0 ? 'high' : 'auto'; 
      document.head.appendChild(link);
    });
  };

  const handleNext = () => sliderRef.current.slickNext();
  const handlePrev = () => sliderRef.current.slickPrev();

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    adaptiveHeight: true,
    nextArrow: null,
    prevArrow: null,
    appendDots: (dots) => (
      <div>
        <ul className="m-0 p-0">{dots}</ul>
      </div>
    ),
    customPaging: () => (
      <div className="w-3 h-3 mx-1 rounded-full bg-white opacity-50 hover:opacity-100 transition-opacity duration-300" />
    ),
    responsive: [
      {
        breakpoint: 768,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  if (!firstImageLoaded) {
    return <SkeletonLoader />;
  }

  return (
    <div className="relative w-full overflow-hidden">
      <div className="max-w-screen-lg mx-auto relative">
        <Suspense fallback={<SkeletonLoader />}>
          <Slider ref={sliderRef} {...sliderSettings}>
            {heroImages.map((image, index) => (
              <div key={index} className="relative w-full">
                <img
                  src={image}
                  alt={`Imagen del carrusel ${index + 1}`}
                  className="w-full h-auto rounded-lg"
                  width="1920"
                  height="1080"
                  loading={index === 0 ? 'eager' : 'lazy'}
                  fetchpriority={index === 0 ? 'high' : 'auto'}
                />
              </div>
            ))}
          </Slider>
        </Suspense>
        <div className="hidden lg:flex absolute top-1/2 left-[-180px] transform -translate-y-1/2 z-20">
          <button
            className="p-4 rounded-full bg-white"
            onClick={handlePrev}
            aria-label="Ir a la imagen anterior"
          >
            <ChevronLeft size={80} color="black" />
          </button>
        </div>
        <div className="hidden lg:flex absolute top-1/2 right-[-180px] transform -translate-y-1/2 z-20">
          <button
            className="p-4 rounded-full bg-white"
            onClick={handleNext}
            aria-label="Ir a la siguiente imagen"
          >
            <ChevronRight size={80} color="black" />
          </button>
        </div>
      </div>
    </div>
  );
}

function SkeletonLoader() {
  return (
    <div className="relative w-full overflow-hidden">
      <div className="max-w-screen-lg mx-auto">
        <div className="relative pb-[50%]">
          <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
          </div>
        </div>
      </div>
    </div>
  );
}
