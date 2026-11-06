
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

function BookingForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    date: "",
    startTime: "",
    endTime: "",
    purpose: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/bookings", {
        resource: id,
        ...form
      });

      alert("Booking request submitted successfully!");
      navigate("/my-bookings");
    } catch (err) {
      setError(
        err.response?.data?.message || "Booking failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container">
      <form className="form-card" onSubmit={handleSubmit}>
        <h1>Book Resource</h1>

        {error && <p className="error">{error}</p>}

        <label>Date</label>
        <input
          type="date"
          name="date"
          min={new Date().toLocaleDateString("en-CA")}
          value={form.date}
          onChange={handleChange}
          required
        />

        <label>Start Time</label>
        <input
          type="time"
          name="startTime"
          value={form.startTime}
          onChange={handleChange}
          required
        />

        <label>End Time</label>
        <input
          type="time"
          name="endTime"
          value={form.endTime}
          onChange={handleChange}
          required
        />

        <label>Purpose</label>
        <textarea
          name="purpose"
          placeholder="Why do you need this resource?"
          value={form.purpose}
          onChange={handleChange}
          required
        />

        <button disabled={loading}>
          {loading ? "Submitting..." : "Submit Booking"}
        </button>
      </form>
    </main>
  );
}

export default BookingForm;
