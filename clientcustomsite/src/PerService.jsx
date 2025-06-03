import React, { useState } from 'react';
import { FaUsers } from 'react-icons/fa';

const PerServiceComponent = ({ bookings, professionals, onSubmit }) => {
  const [selections, setSelections] = useState({});
  const [modalBookingId, setModalBookingId] = useState(null);

  const handleSelectProfessional = (bookingId, value) => {
    setSelections((prev) => ({
      ...prev,
      [bookingId]: value,
    }));
    setModalBookingId(null); // Close modal
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(selections);
    }
  };

  const getOptions = (bookingId) => {
    const proOptions = professionals
      .filter((pro) => pro.services.includes(bookingId.toString()))
      .map((pro) => ({
        value: pro._id,
        label: pro.name,
        image: `http://localhost:8080${pro.image}`,
      }));

    return [
      {
        value: 'max_availability',
        label: 'Any professional with maximum availability',
        icon: <FaUsers className="text-blue-600 w-6 h-6" />,
      },
      ...proOptions,
    ];
  };

  return (
    <div className="w-full max-w-3xl mt-10 mx-auto">
      <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">
        Choose Professionals Per Service
      </h2>

      {bookings.map((booking) => {
        const bookingId = booking._id;
        const selectedValue = selections[bookingId];
        const selectedOption = getOptions(bookingId).find(
          (opt) => opt.value === selectedValue
        );

        return (
          <div key={bookingId} className="mb-8 border border-gray-200 bg-white p-6 rounded-lg shadow">
            <div className="text-lg font-semibold text-gray-700 mb-1">
              {booking.name || 'Unnamed Service'}
            </div>
            <div className="text-sm text-gray-500 mb-4">
              Duration: {booking.duration || 'Unknown'} mins
            </div>

            <button
              onClick={() => setModalBookingId(bookingId)}
              className="bg-gray-100 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-200 transition"
            >
              {selectedOption ? (
                <div className="flex items-center gap-2">
                  {selectedOption.image ? (
                    <img
                      src={selectedOption.image}
                      alt={selectedOption.label}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  ) : (
                    selectedOption.icon
                  )}
                  <span>{selectedOption.label}</span>
                </div>
              ) : (
                'Choose Professional'
              )}
            </button>
          </div>
        );
      })}

      <div className="text-center mt-10">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md text-lg font-medium transition"
        >
          Continue
        </button>
      </div>

      {/* Modal */}
      {modalBookingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl p-6 relative">
            <h3 className="text-xl font-bold mb-4">Select Professional</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {getOptions(modalBookingId).map((option) => (
                <div
                  key={option.value}
                  onClick={() => handleSelectProfessional(modalBookingId, option.value)}
                  className="flex items-center justify-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-blue-50 transition"
                >
                  <div className="flex flex-col items-center">
                    {option.image ? (
                      <img
                        src={option.image}
                        alt={option.label}
                        className="w-16 h-16 rounded-full object-cover mb-2"
                      />
                    ) : option.icon ? (
                      <div className="w-16 h-16 flex items-center justify-center mb-2">
                        {option.icon}
                      </div>
                    ) : null}
                    <span className="text-sm">{option.label}</span>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setModalBookingId(null)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerServiceComponent;
