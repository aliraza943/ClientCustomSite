import React, { useEffect, useRef, useState } from 'react';

const ServicesList = ({ services, loading, error, addToBooking }) => {
  const [currentCategory, setCurrentCategory] = useState('');
  const [visibleIndex, setVisibleIndex] = useState(0);
  const containerRef = useRef(null);
  const categoryRefs = useRef({});

  const formatCAD = (amount) =>
    new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
    }).format(amount || 0);

  // Group services by category
  const groupedServices = services.reduce((acc, service) => {
    if (!acc[service.category]) acc[service.category] = [];
    acc[service.category].push(service);
    return acc;
  }, {});

  const categories = Object.keys(groupedServices);
  const visibleCategories = categories.slice(visibleIndex, visibleIndex + 3);

  const scrollToCategory = (category) => {
    const el = categoryRefs.current[category];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handlePrev = () => {
    setVisibleIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setVisibleIndex((prev) => Math.min(prev + 1, categories.length - 3));
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cat = entry.target.getAttribute('data-category');
            setCurrentCategory((prev) => {
              if (prev !== cat) {
                const newIndex = categories.indexOf(cat);
                // Auto shift visible window if needed
                if (newIndex < visibleIndex || newIndex >= visibleIndex + 3) {
                  const adjusted = Math.max(0, Math.min(newIndex, categories.length - 3));
                  setVisibleIndex(adjusted);
                }
              }
              return cat;
            });
          }
        });
      },
      {
        root: containerRef.current,
        threshold: 0.4,
      }
    );
  
    categories.forEach((cat) => {
      const el = categoryRefs.current[cat];
      if (el) observer.observe(el);
    });
  
    return () => observer.disconnect();
  }, [categories, visibleIndex]);
  

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 flex-1 min-h-[600px] relative">
      <h2 className="text-3xl font-bold mb-4">Available Services</h2>

      {/* Top Category Selector with Arrow Buttons */}
      <div className="mb-6 flex items-center gap-4 sticky top-0 z-20 bg-white py-2">
        <button
          onClick={handlePrev}
          disabled={visibleIndex === 0}
          className="px-3 py-2 bg-white border rounded-full shadow disabled:opacity-40"
        >
          &#8592;
        </button>

        <div className="flex gap-4">
          {visibleCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => scrollToCategory(cat)}
              className={`px-4 py-2 rounded-full border text-sm transition-colors ${
                currentCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-blue-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={visibleIndex + 3 >= categories.length}
          className="px-3 py-2 bg-white border rounded-full shadow disabled:opacity-40"
        >
          &#8594;
        </button>
      </div>

      {/* Services Content */}
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : categories.length === 0 ? (
        <p>No services available.</p>
      ) : (
        <div
          ref={containerRef}
          className="space-y-16 overflow-y-auto max-h-[600px] pr-2 scroll-smooth"
        >
          {categories.map((category) => (
            <div
              key={category}
              ref={(el) => (categoryRefs.current[category] = el)}
              data-category={category}
              className="scroll-mt-24"
            >
              <h3 className="text-2xl font-bold mb-4 text-blue-700">{category}</h3>
              <div className="space-y-5">
                {groupedServices[category].map((service) => (
                  <div
                    key={service._id}
                    className="border rounded-lg p-5 bg-gray-50 flex justify-between items-center"
                  >
                    <div>
                      <h4 className="text-lg font-medium">{service.name}</h4>
                      <p className="text-sm text-gray-700">{service.description}</p>
                      <p className="text-base font-medium text-gray-900 mt-1">
                        Price: <span className="text-blue-600">{formatCAD(service.price)}</span>
                      </p>
                    </div>
                    <button
                      onClick={() => addToBooking(service)}
                      className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full"
                      title="Add to Booking"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServicesList;
