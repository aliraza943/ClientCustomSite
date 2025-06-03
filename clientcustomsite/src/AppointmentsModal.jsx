import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom'; // ← Add this

const AppointmentModal = ({ open, onClose, slot, appointments }) => {
  const navigate = useNavigate(); // ← Add this
  const [enriched, setEnriched] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (!open) return;

    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('http://localhost:8080/api/website/staffandDetails', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ appointments })
        });
        const data = await res.json();
        if (data.success) {
          setEnriched(data.enriched);
        } else {
          throw new Error(data.message || 'Failed to load details');
        }
      } catch (err) {
        console.error('Error fetching appointment details', err);
        setError(err.message);
        setEnriched(appointments); // fallback
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [open, appointments]);
  

  if (!open) return null;

const handleContinue = () => {
  // Save to localStorage
  localStorage.setItem('appointments', JSON.stringify(enriched));

  // Navigate to /login
  navigate('/login');
};

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 backdrop-blur-md bg-black/40 z-40" />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
        <div className="bg-white rounded-xl w-full max-w-lg p-6 relative pointer-events-auto shadow-2xl">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl"
          >
            ✕
          </button>

          {/* Title */}
          <h3 className="text-2xl font-semibold mb-6 text-center text-gray-800">
            Appointments for <span className="text-blue-600">{slot.label}</span> <br />
            <span className="text-sm text-gray-500">{slot.start.slice(0, 10)}</span>
          </h3>

          {loading && <div className="text-center">Loading details…</div>}
          {error && (
            <div className="text-center text-red-500 font-medium">
              Error: {error}
            </div>
          )}

          {!loading && !error && (
            <ul className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {enriched.map((a, i) => (
                <li
                  key={i}
                  className="flex items-start gap-4 p-4 border rounded-lg shadow-sm hover:shadow-md transition"
                >
                  <img
                src={a.staff?.image ? `http://localhost:8080${a.staff.image}` : 'https://via.placeholder.com/64'}

                    alt={a.staff?.name || a.staffId}
                    className="w-16 h-16 rounded-full object-cover border"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800">
                      Service: <span className="text-blue-600">{a.service?.name || a.serviceId}</span>
                    </div>
                    <div className="text-gray-600">
                      Staff: <span className="font-medium">{a.staff?.name || a.staffId}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      Time: {new Date(a.start).toLocaleTimeString()} – {new Date(a.end).toLocaleTimeString()}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* Confirm Button */}
          {!loading && !error && (
            <div className="mt-6 text-center">
            <div className="mt-6 text-center">
  <button
    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition"
    onClick={handleContinue}
  >
    Continue
  </button>
</div>

            </div>
          )}
        </div>
      </div>
    </>
  );
};

AppointmentModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  slot: PropTypes.shape({
    label: PropTypes.string,
    start: PropTypes.string
  }).isRequired,
  appointments: PropTypes.arrayOf(
    PropTypes.shape({
      serviceId: PropTypes.string,
      staffId: PropTypes.string,
      start: PropTypes.string,
      end: PropTypes.string
    })
  ).isRequired
};

export default AppointmentModal;
