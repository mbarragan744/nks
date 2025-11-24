import React from 'react';
import HeroSection from '../components/home/HeroSection';
import SearchBar from '../components/home/SearchBar';
import TestimonialSection from '../components/home/TestimonialSection';
import Features from '../components/home/Features';
import FeaturedProducts from '../components/home/FeaturedProducts';

export default function Home() {

  return (
    <div className='flex-grow px-4 py-8 sm:px-6 lg:py-10'>
      <SearchBar />
      <HeroSection/>
      <FeaturedProducts />
      <TestimonialSection />
      <Features />
    </div>
  );
}
