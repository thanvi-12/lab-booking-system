
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import Navbar from "./components/Navbar";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Resources from "./pages/Resources";
import BookingForm from "./pages/BookingForm";
import MyBookings from "./pages/MyBookings";
import AdminDashboard from "./pages/AdminDashboard";

import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />

        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/resources" element={<Resources />} />
            <Route path="/book/:id" element={<BookingForm />} />
            <Route path="/my-bookings" element={<MyBookings />} />
          </Route>

          <Route element={<AdminRoute />}>
            <Route
              path="/admin/dashboard"
              element={<AdminDashboard />}
            />
          </Route>

          <Route path="*" element={<h1>404 - Page Not Found</h1>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
