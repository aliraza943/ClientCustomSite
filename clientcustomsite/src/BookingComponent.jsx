import React from 'react';

const BookingCart = ({ bookings, removeBooking,onContinue }) => {
  const totalPrice = bookings.reduce((sum, item) => sum + (item.price || 0), 0);

  const formatCAD = (amount) =>
    new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
    }).format(amount || 0);

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 flex-1 min-h-[600px]">
      <h2 className="text-3xl font-bold mb-6">Your Services</h2>
      {bookings.length === 0 ? (
        <p>No services added yet.</p>
      ) : (
        <>
          <ul className="space-y-5">
            {bookings.map((booking) => (
              <li
                key={booking._id}
                className="flex justify-between items-center bg-gray-100 rounded p-4"
              >
                <div>
                  <span className="font-medium text-lg">{booking.name}</span>
                  <p className="text-sm text-gray-700">
                    Price: <span className="text-blue-600">{formatCAD(booking.price)}</span>
                  </p>
                </div>
                <button
                  onClick={() => removeBooking(booking._id)}
                  className="text-red-500 hover:text-red-700 text-lg font-bold p-2 rounded-full bg-white shadow"
                  title="Remove service"
                >
                  &minus;
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-6 text-right text-xl font-semibold">
            Total: <span className="text-green-700">{formatCAD(totalPrice)}</span>
          </div>
        
<button
  onClick={onContinue}
  className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded"
>
  Continue
</button>

        </>
      )}
    </div>
  );
};

export default BookingCart;
