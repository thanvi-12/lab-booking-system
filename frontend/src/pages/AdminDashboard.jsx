
import { useEffect, useState } from "react";
import api from "../api/axios";

function AdminDashboard() {
  const [resources, setResources] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [resourceForm, setResourceForm] = useState({
    name: "",
    type: "Lab",
    location: "",
    capacity: 1
  });

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const [resourceResponse, bookingResponse] =
        await Promise.all([
          api.get("/resources"),
          api.get("/bookings", {
            params: {
              ...(statusFilter && { status: statusFilter }),
              ...(dateFilter && { date: dateFilter })
            }
          })
        ]);

      setResources(resourceResponse.data.data);
      setBookings(bookingResponse.data.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [statusFilter, dateFilter]);

  const addResource = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/resources", {
        ...resourceForm,
        capacity: Number(resourceForm.capacity)
      });

      setResourceForm({
        name: "",
        type: "Lab",
        location: "",
        capacity: 1
      });

      await loadData();
      alert("Resource added successfully");
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to add resource"
      );
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/bookings/${id}/status`, { status });
      await loadData();
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to update booking"
      );
    }
  };

  const deactivateResource = async (id) => {
    if (!window.confirm("Deactivate this resource?")) return;

    try {
      await api.delete(`/resources/${id}`);
      await loadData();
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to deactivate resource"
      );
    }
  };

  return (
    <main className="container">
      <h1>Admin Dashboard</h1>
      <p>Manage resources and student bookings.</p>

      {error && <p className="error">{error}</p>}

      <section className="admin-section">
        <h2>Add New Resource</h2>

        <form className="resource-form" onSubmit={addResource}>
          <input
            placeholder="Resource name"
            value={resourceForm.name}
            onChange={(e) =>
              setResourceForm({
                ...resourceForm,
                name: e.target.value
              })
            }
            required
          />

          <select
            value={resourceForm.type}
            onChange={(e) =>
              setResourceForm({
                ...resourceForm,
                type: e.target.value
              })
            }
          >
            <option>Lab</option>
            <option>Projector</option>
            <option>Seminar Hall</option>
            <option>Device</option>
          </select>

          <input
            placeholder="Location"
            value={resourceForm.location}
            onChange={(e) =>
              setResourceForm({
                ...resourceForm,
                location: e.target.value
              })
            }
            required
          />

          <input
            type="number"
            min="1"
            placeholder="Capacity"
            value={resourceForm.capacity}
            onChange={(e) =>
              setResourceForm({
                ...resourceForm,
                capacity: e.target.value
              })
            }
            required
          />

          <button type="submit">Add Resource</button>
        </form>
      </section>

      <section className="admin-section">
        <h2>Manage Resources</h2>

        <div className="resource-grid">
          {resources.map((resource) => (
            <div className="resource-card" key={resource._id}>
              <h3>{resource.name}</h3>
              <p>{resource.type}</p>
              <p>{resource.location}</p>
              <p>Capacity: {resource.capacity}</p>

              <button
                className="danger-button"
                onClick={() => deactivateResource(resource._id)}
              >
                Deactivate
              </button>
            </div>
          ))}
        </div>

        {!resources.length && <p>No active resources.</p>}
      </section>

      <section className="admin-section">
        <h2>All Booking Requests</h2>

        <div className="filters">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />

          <button
            type="button"
            onClick={() => {
              setStatusFilter("");
              setDateFilter("");
            }}
          >
            Clear Filters
          </button>
        </div>

        {loading ? (
          <p>Loading bookings...</p>
        ) : (
          bookings.map((booking) => (
            <div className="booking-card" key={booking._id}>
              <h3>{booking.resource?.name || "Resource"}</h3>

              <p>
                Student: {booking.user?.name || "Unknown"}
              </p>

              <p>
                Email: {booking.user?.email || "Unknown"}
              </p>

              <p>Date: {booking.date}</p>

              <p>
                Time: {booking.startTime} - {booking.endTime}
              </p>

              <p>Purpose: {booking.purpose}</p>

              <p>
                Status: <strong>{booking.status}</strong>
              </p>

              {booking.status === "Pending" && (
                <div className="action-buttons">
                  <button
                    onClick={() =>
                      updateStatus(booking._id, "Approved")
                    }
                  >
                    Approve
                  </button>

                  <button
                    className="danger-button"
                    onClick={() =>
                      updateStatus(booking._id, "Rejected")
                    }
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))
        )}

        {!loading && !bookings.length && (
          <p>No booking requests found.</p>
        )}
      </section>
    </main>
  );
}

export default AdminDashboard;
