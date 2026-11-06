
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

function Resources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadResources = async () => {
      try {
        const response = await api.get("/resources");
        setResources(response.data.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Unable to load resources"
        );
      } finally {
        setLoading(false);
      }
    };

    loadResources();
  }, []);

  if (loading) return <p className="center">Loading resources...</p>;

  return (
    <main className="container">
      <h1>Available Resources</h1>

      {error && <p className="error">{error}</p>}

      <div className="resource-grid">
        {resources.map((resource) => (
          <div className="resource-card" key={resource._id}>
            <h2>{resource.name}</h2>
            <p>Type: {resource.type}</p>
            <p>Location: {resource.location}</p>
            <p>Capacity: {resource.capacity}</p>

            <Link
              className="link-button"
              to={`/book/${resource._id}`}
            >
              Book Now
            </Link>
          </div>
        ))}
      </div>

      {!resources.length && !error && (
        <p>No resources available.</p>
      )}
    </main>
  );
}

export default Resources;
