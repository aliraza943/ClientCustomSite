import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ServicesList from './ServiceComponet';
import BookingCart from './BookingComponent';
import ProfessionalComponent from './ProfessionalComponent'; // Updated name to match import
import BookingConfirmation from './BookingComponent'; // Import your BookingConfirmation component
import Step3Component from './Step3Component'; // Import the new Step 3 component

const BookingPage = () => {
  const { siteUrl } = useParams();
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [servicesError, setServicesError] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [professionalData, setProfessionalData] = useState(null); // Store professional data

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:8080/api/website/get-services/${siteUrl}`
        );
        if (data.success) {
          setServices(data.services);
        } else {
          setServicesError('No services returned from server.');
        }
      } catch (err) {
        setServicesError('Failed to load services.');
      } finally {
        setServicesLoading(false);
      }
    };

    if (siteUrl) fetchServices();
  }, [siteUrl]);

  const addToBooking = (service) => {
    if (!bookings.find((b) => b._id === service._id)) {
      setBookings([...bookings, service]);
    }
  };

  const removeBooking = (id) => {
    setBookings(bookings.filter((b) => b._id !== id));
  };

  const handleContinue = (professionalSelection) => {
    setProfessionalData(professionalSelection); // Store the professional selection data
    setCurrentStep(3); // Move to step 3
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <ServicesList
              services={services}
              loading={servicesLoading}
              error={servicesError}
              addToBooking={addToBooking}
            />
            <BookingCart
              bookings={bookings}
              removeBooking={removeBooking}
              onContinue={handleContinue} // Pass the handleContinue function to BookingConfirmation
            />
          </>
        );
      case 2:
        return (
          <ProfessionalComponent
            bookings={bookings}
            professionalData={professionalData} // Pass professionalData to ProfessionalComponent
          />
        );
      case 3:
        return <Step3Component professionalData={professionalData} />; // Display data in Step 3
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Stepper UI */}
      <div className="flex justify-center gap-10 mb-10">
        <button
          className={`py-2 px-4 rounded-full border-2 font-semibold ${
            currentStep === 1
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-600 border-gray-300'
          }`}
          onClick={() => setCurrentStep(1)}
        >
          1. Select Services
        </button>
        <button
          className={`py-2 px-4 rounded-full border-2 font-semibold ${
            currentStep === 2
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-600 border-gray-300'
          }`}
          onClick={() => {
            if (bookings.length > 0) {
              setCurrentStep(2);
            }
          }}
          disabled={bookings.length === 0}
        >
          2. Select Professional
        </button>
        <button
          className={`py-2 px-4 rounded-full border-2 font-semibold ${
            currentStep === 3
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-600 border-gray-300'
          }`}
          onClick={() => {
            if (professionalData) {
              setCurrentStep(3); // Move to Step 3
            }
          }}
          disabled={!professionalData}
        >
          3. Review & Confirm
        </button>
      </div>

      {/* Step content */}
      <div className="flex flex-col lg:flex-row gap-10">{renderStepContent()}</div>
    </div>
  );
};

export default BookingPage;
