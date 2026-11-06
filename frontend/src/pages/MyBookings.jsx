
import { useEffect, useState } from "react";
import api from "../api/axios";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadBookings = async () => {
    try {
      const response = await api.get("/bookings/my");
      setBookings(response.data.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load bookings"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const cancelBooking = async (id) => {
    if (!window.confirm("Are you sure you want to cancel?")) return;

    try {
      await api.patch(`/bookings/${id}/cancel`);
      await loadBookings();
    } catch (err) {
      setError(
        err.response?.data?.message || "Cancellation failed"
      );
    }
  };

  if (loading) return <p className="center">Loading bookings...</p>;

  return (
    <main className="container">
      <h1>My Bookings</h1>

      {error && <p className="error">{error}</p>}

      {bookings.map((booking) => (
        <div className="booking-card" key={booking._id}>
          <h3>{booking.resource?.name || "Resource"}</h3>

          <p>Date: {booking.date}</p>
          <p>Time: {booking.startTime} - {booking.endTime}</p>
          <p>Purpose: {booking.purpose}</p>
          <p>
            Status: <strong>{booking.status}</strong>
          </p>

          {["Pending", "Approved"].includes(booking.status) && (
            <button
              className="danger-button"
              onClick={() => cancelBooking(booking._id)}
            >
              Cancel Booking
            </button>
          )}
        </div>
      ))}

      {!bookings.length && <p>No bookings found.</p>}
    </main>
  );
}

export default MyBookings;
