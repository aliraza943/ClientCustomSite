import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { useParams } from 'react-router-dom';
import AppointmentModal from './AppointmentsModal';

const ConfirmationComponent = ({ bookings, selection }) => {
  const [selectedDay, setSelectedDay] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [availability, setAvailability] = useState({});
  const [visibleStartIndex, setVisibleStartIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeSlot, setActiveSlot] = useState(null);
  const daysPerPage = 7;
  const { siteUrl } = useParams();

  // Fetch availability on mount / selection change
  useEffect(() => {
    const fetchData = async () => {
      try {
        const today = new Date().toLocaleDateString('en-CA');
        const payload = { selection, date: today };
        const res = await fetch(
          `http://localhost:8080/api/website/get-availability/${siteUrl}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          }
        );
        const data = await res.json();
        if (data.success) setAvailability(data.availableSlots || {});
      } catch (err) {
        console.error('Error fetching availability:', err);
      }
    };
    fetchData();
  }, [siteUrl, selection]);

  // Generate list of days in next 3 months
  const generateThreeMonthsDays = () => {
    const days = [];
    const today = dayjs();
    for (let m = 0; m < 3; m++) {
      let d = today.add(m, 'month').startOf('month');
      const end = today.add(m, 'month').endOf('month');
      while (d.isBefore(end) || d.isSame(end, 'day')) {
        days.push(d);
        d = d.add(1, 'day');
      }
    }
    return days;
  };
  const allDays = generateThreeMonthsDays();
  const visibleDays = allDays.slice(
    visibleStartIndex,
    Math.min(visibleStartIndex + daysPerPage, allDays.length)
  );

  // When a day is selected
  const handleDaySelect = (day) => {
    setSelectedDay(day);
    const key = day.format('YYYY-MM-DD');
    const now = dayjs();

    const filteredSlots = (availability[key] || []).filter((slot) => {
      const slotTime = dayjs(`${key}T${slot.start}`);
      return !day.isSame(now, 'day') || slotTime.isAfter(now);
    });

    setTimeSlots(filteredSlots);
  };

  // Date picker jump
  const handleDatePicker = (e) => {
    const d = dayjs(e.target.value);
    if (allDays.some((x) => x.isSame(d, 'day'))) handleDaySelect(d);
  };

  // Pagination
  const handleNext = () => {
    const nextIndex = visibleStartIndex + daysPerPage;
    if (nextIndex < allDays.length) {
      setVisibleStartIndex(nextIndex);
    } else if (visibleStartIndex + daysPerPage < allDays.length + daysPerPage) {
      setVisibleStartIndex(Math.max(allDays.length - daysPerPage, 0));
    }
  };

  const handlePrev = () => {
    setVisibleStartIndex((i) => Math.max(0, i - daysPerPage));
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Confirmation</h2>

      {/* Date Picker */}
      <div className="mb-4">
        <label className="mr-2 font-semibold">Jump to date:</label>
        <input
          type="date"
          min={allDays[0].format('YYYY-MM-DD')}
          max={allDays[allDays.length - 1].format('YYYY-MM-DD')}
          onChange={handleDatePicker}
          className="border px-2 py-1"
        />
      </div>

      {/* Week Scroller */}
      <div className="mb-6 flex items-center gap-2">
        <button
          onClick={handlePrev}
          disabled={visibleStartIndex === 0}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          ← Prev
        </button>
        <div className="flex gap-2 overflow-x-auto">
          {visibleDays.map((day) => {
            const key = day.format('YYYY-MM-DD');
            const has = availability[key]?.length > 0;
            return (
              <button
                key={key}
                disabled={!has}
                onClick={() => has && handleDaySelect(day)}
                className={`min-w-[60px] px-2 py-1 rounded border text-center ${
                  selectedDay?.isSame(day, 'day')
                    ? 'bg-blue-600 text-white'
                    : has
                    ? 'bg-white text-gray-700 border-gray-300'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                <div>{day.format('DD')}</div>
                <div className="text-xs">{day.format('ddd')}</div>
              </button>
            );
          })}
        </div>
        <button
          onClick={handleNext}
          disabled={visibleStartIndex + daysPerPage >= allDays.length}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next →
        </button>
      </div>

      {/* Time Slots */}
      {selectedDay && (
        <div>
          <h4 className="font-semibold mb-2">
            Time Slots for {selectedDay.format('MMMM D, YYYY')}:
          </h4>
          <div className="flex flex-wrap gap-3">
            {timeSlots.length > 0 ? (
              timeSlots.map((slot) => (
                <div
                  key={slot.start}
                  className="px-4 py-2 bg-gray-200 rounded cursor-pointer hover:bg-blue-500 hover:text-white"
                  onClick={() => {
                    setActiveSlot(slot);
                    setModalOpen(true);
                  }}
                >
                  {slot.label}
                </div>
              ))
            ) : (
              <div className="text-gray-500">No available time slots.</div>
            )}
          </div>
        </div>
      )}

      {/* Appointment Modal */}
      <AppointmentModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        slot={activeSlot || { label: '', start: '' }}
        appointments={activeSlot?.appointments || []}
      />
    </div>
  );
};

export default ConfirmationComponent;
