const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const resourceRoutes = require("./routes/resourceRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

const loggerMiddleware = require("./middlewares/loggerMiddleware");

const {
  notFound,
  errorHandler
} = require("./middlewares/errorMiddleware");

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173"
}));

app.use(express.json());

app.use(loggerMiddleware);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Lab Booking API is running"
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/bookings", bookingRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;