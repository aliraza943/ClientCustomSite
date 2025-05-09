import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaUsers, FaUserTie } from 'react-icons/fa';
import PerServiceComponent from './PerService'; // renamed for clarity

const BookingConfirmation = ({ bookings, onContinue = console.log }) => {
  const { siteUrl } = useParams();
  const [professionals, setProfessionals] = useState([]);
  const [selectedProfessionalId, setSelectedProfessionalId] = useState(null);
  const [optionSelected, setOptionSelected] = useState(null); // 'any' | 'perService' | 'single'
  const [showPerServiceView, setShowPerServiceView] = useState(false);

  const isSingleBooking = bookings.length === 1;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookingIds = bookings.map(b => b._id);
        const res = await fetch(
          `http://localhost:8080/api/website/get-professionals/${siteUrl}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bookingIds }),
          }
        );
        const data = await res.json();
        if (data.success) setProfessionals(data.professionals);
      } catch (err) {
        console.error('Error fetching professionals:', err);
      }
    };
    fetchData();
  }, [siteUrl, bookings]);

  const handleSelectAny = () => {
    setOptionSelected('any');
    setSelectedProfessionalId(null);
  };

  const handleChoosePerService = () => {
    setOptionSelected('perService');
  };

  const handleSingleSelect = (id) => {
    setSelectedProfessionalId(id);
    setOptionSelected('single');
  };

  const handleContinue = () => {
    const selection = {};
  
    if (optionSelected === 'any') {
      bookings.forEach((booking) => {
        selection[booking._id] = 'max_availability';
      });
      onContinue({ option: 'any', selection });
    } else if (optionSelected === 'single' && selectedProfessionalId) {
      bookings.forEach((booking) => {
        selection[booking._id] = selectedProfessionalId;
      });
      onContinue({ option: 'single', selection });
    } else if (optionSelected === 'perService') {
      setShowPerServiceView(true);
    }
  };
  
  // If per-service view is active, render ONLY that
  if (showPerServiceView) {
    return (
      <PerServiceComponent
        bookings={bookings}
        professionals={professionals}
        onSubmit={(selectionMap) => {
          onContinue({ option: 'perService', selection: selectionMap });
        }}
      />
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 flex-1 min-h-[300px] flex flex-col justify-center items-center">
      <h2 className="text-4xl font-bold mb-10 text-center">Select Professionals</h2>

      <div
        className={`w-full max-w-3xl ${
          isSingleBooking ? 'flex flex-col items-center gap-4' : 'flex justify-between gap-6'
        }`}
      >
        <button
          onClick={handleSelectAny}
          className={`w-full bg-blue-50 text-black text-lg px-6 py-4 rounded-xl flex items-center justify-center gap-3 border ${
            optionSelected === 'any' ? 'border-blue-500 ring-2 ring-blue-300' : 'border-transparent'
          }`}
        >
          <FaUsers className="text-2xl" />
          Select any professional for maximum availability
        </button>

        {!isSingleBooking && (
          <button
            onClick={handleChoosePerService}
            className={`w-full bg-blue-50 text-black text-lg px-6 py-4 rounded-xl flex items-center justify-center gap-3 border ${
              optionSelected === 'perService' ? 'border-blue-500 ring-2 ring-blue-300' : 'border-transparent'
            }`}
          >
            <FaUserTie className="text-2xl" />
            Choose professional per service
          </button>
        )}
      </div>

      {isSingleBooking && professionals.length > 0 && (
        <div className="mt-10 w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-6">
          {professionals.map((pro) => (
            <div
              key={pro._id}
              onClick={() => handleSingleSelect(pro._id)}
              className={`cursor-pointer border p-4 rounded-lg shadow text-center flex flex-col items-center transition duration-150 hover:shadow-lg ${
                selectedProfessionalId === pro._id ? 'border-blue-500 ring-2 ring-blue-300' : ''
              }`}
            >
              <img
                src={pro.image ? `http://localhost:8080${pro.image}` : 'https://via.placeholder.com/100'}
                alt={pro.name}
                className="w-24 h-24 rounded-full object-cover mb-4"
              />
              <h3 className="text-xl font-semibold">{pro.name}</h3>
            </div>
          ))}
        </div>
      )}

      {(optionSelected === 'any' ||
        optionSelected === 'perService' ||
        (optionSelected === 'single' && selectedProfessionalId)) && (
        <button
          onClick={handleContinue}
          className="mt-10 bg-blue-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-700 transition"
        >
          Continue
        </button>
      )}
    </div>
  );
};

export default BookingConfirmation;
