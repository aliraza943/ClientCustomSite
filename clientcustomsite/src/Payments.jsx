import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const PaymentPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [bill, setBill] = useState(null);
  const payments = useRef(null);
  const card = useRef(null);
  const location = useLocation();

  const appId = import.meta.env.VITE_SQUARE_APP_ID;
  const locationId = import.meta.env.VITE_SQUARE_LOCATION_ID;

  const billId = location.state?.billId;
  const accessToken = localStorage.getItem('accessToken');

  // 1) Load appointments passed via react-router state
  useEffect(() => {
    if (location.state?.appointments) {
      setAppointments(location.state.appointments);
    }
  }, [location.state]);

  // 2) Initialize Square Web Payments SDK when we have a billId
  useEffect(() => {
    if (!billId) return;

    const loadSquare = async () => {
      if (!window.Square) {
        alert('Square payments SDK failed to load.');
        return;
      }
      try {
        payments.current = window.Square.payments(appId, locationId);
        card.current = await payments.current.card();
        await card.current.attach('#card-container');
      } catch (e) {
        console.error('Square setup failed', e);
      }
    };

    loadSquare();
  }, [appId, locationId, billId]);

  // 3) Fetch the bill object from our backend
  useEffect(() => {
    const fetchBill = async () => {
      if (!billId || !accessToken) return;

      try {
        const res = await fetch(`http://localhost:8080/api/payment/bill/${billId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const data = await res.json();

        if (res.ok) {
          setBill(data.bill);
        } else {
          console.error('Failed to fetch bill:', data.message);
        }
      } catch (err) {
        console.error('Error fetching bill:', err);
      }
    };

    fetchBill();
  }, [billId, accessToken]);

  // 4) On submit, tokenize card and send nonce + billId + appointments to backend
  const handlePayment = async (e) => {
    e.preventDefault();
    if (!card.current) {
      alert('Card element not loaded.');
      return;
    }

    try {
      const result = await card.current.tokenize();
      if (result.status === 'OK') {
        const cardNonce = result.token;

        const response = await fetch('http://localhost:8080/api/payment/payAppoint', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            cardNonce,
            billId,
            appointments,
          }),
        });

        const data = await response.json();
        if (response.ok) {
          alert('Payment successful!');
          setAppointments([]); // clear appointments after success
        } else {
          alert('Payment failed: ' + data.message);
        }
      } else {
        alert('Failed to tokenize card: ' + result.errors?.[0]?.message);
      }
    } catch (err) {
      console.error('Tokenization error:', err);
      alert('An error occurred while processing the card.');
    }
  };

  // 5) While billId is not yet set, show a simple loading indicator
  if (!billId) {
    return <div className="p-6 text-center text-gray-600">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-6 space-y-6">
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Confirm Your Appointments
        </h2>

        {/* 6) Show the list of appointments still pending payment */}
        {appointments.length > 0 ? (
          <ul className="space-y-3">
            {appointments.map((appt, index) => (
              <li
                key={index}
                className="p-3 border rounded-md bg-gray-100 flex items-center gap-4"
              >
                {appt.staff?.image && (
                  <img
                    src={`http://localhost:8080${appt.staff.image}`}
                    alt={appt.staff.name}
                    className="w-20 h-20 rounded-full object-cover border"
                  />
                )}
                <div>
                  <p>
                    <strong>Service:</strong> {appt.service?.name || appt.serviceName || 'N/A'}
                  </p>
                  <p>
                    <strong>Provider:</strong> {appt.staff?.name || appt.staffName || 'N/A'}
                  </p>
                  <p>
                    <strong>Time:</strong>{' '}
                    {new Date(appt.start || appt.time).toLocaleString()}
                  </p>
                  <p>
                    <strong>Expires At:</strong>{' '}
                    {new Date(appt.expiresAt).toLocaleString()}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center">No appointments found.</p>
        )}

        {/* 7) Once the bill is loaded, show the payment form and summary */}
        {bill && (
          <>
            <h3 className="text-lg font-semibold">Payment Details</h3>

            <form onSubmit={handlePayment} className="space-y-6">
              {/* 7a) Square Card container */}
              <div id="card-container" className="w-full border px-4 py-2 rounded-md" />

              {/* 7b) Bill Summary */}
              <div className="border rounded-md p-4 bg-gray-50">
                <h4 className="font-semibold mb-2 text-gray-700">Bill Summary</h4>
                <ul className="space-y-2">
                  {bill.itemized?.map((item, idx) => {
                    // ────────────────
                    // Now we read `item.total` (not inside taxBreakdown).
                    const basePrice = Number(item.basePrice || 0);
                    const taxObj = item.taxBreakdown?.HST || { percentage: 0, amount: 0 };
                    const taxPercentage = Number(taxObj.percentage || 0);
                    const taxAmount = Number(taxObj.amount || 0);
                    const totalForThisItem = Number(item.total || 0);

                    return (
                      <li
                        key={item._id || idx}
                        className="border p-2 rounded-md bg-white"
                      >
                        <p>
                          <strong>Service:</strong> {item.serviceName}
                        </p>
                        <p>
                          <strong>Base Price:</strong> ${basePrice.toFixed(2)}
                        </p>
                        <p>
                          <strong>Tax (HST {taxPercentage}%):</strong> ${taxAmount.toFixed(2)}
                        </p>
                        <p className="font-semibold text-green-700 text-lg">
                          <strong>Total:</strong> ${totalForThisItem.toFixed(2)}
                        </p>
                      </li>
                    );
                  })}
                </ul>

                <div className="mt-4 text-right text-xl font-bold text-green-700">
                  Total Due: ${Number(bill.total || 0).toFixed(2)}
                </div>
              </div>

              {/* 7c) Final Submit Button */}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700"
              >
                Submit Payment
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;
