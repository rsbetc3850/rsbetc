'use client';
import React, { useState, useEffect } from 'react';
import ServiceCard from './ServiceCard';

const Carousel = ({ services }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);



  // Auto-play functionality
  useEffect(() => {

    // Function to move to the next slide
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === services.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Function to move to the previous slide
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? services.length - 1 : prevIndex - 1
    );
  };
    let intervalId;
    if (isAutoPlay) {
      intervalId = setInterval(nextSlide, 5000); // Change slide every 5 seconds
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isAutoPlay]);

  // Function to toggle auto-play
  const toggleAutoPlay = () => {
    setIsAutoPlay((prev) => !prev);
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <div className="overflow-hidden">
        <div 
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {services.map((service, index) => (
            <div key={index} className="w-full flex-shrink-0">
              <ServiceCard title={service.title} items={service.items} />
            </div>
          ))}
        </div>
      </div>
      
      {/* Navigation buttons */}
      <button 
        onClick={prevSlide}
        className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
      >
        &#8592; {/* Left arrow */}
      </button>
      <button 
        onClick={nextSlide}
        className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
      >
        &#8594; {/* Right arrow */}
      </button>
      
      {/* Auto-play toggle */}
      <button 
        onClick={toggleAutoPlay}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        {isAutoPlay ? 'Pause' : 'Play'} Auto-play
      </button>
      
      {/* Slide indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {services.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full ${
              index === currentIndex ? 'bg-blue-500' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;

// Usage instructions:
// 1. Import this Carousel component in the services page
// 2. Use it by passing the services array as a prop: <Carousel services={services} />
// 3. Ensure you have the necessary CSS classes for styling (you may need to adjust based on your Tailwind configuration)
// 4. You can customize the auto-play interval, transition duration, and styles as needed