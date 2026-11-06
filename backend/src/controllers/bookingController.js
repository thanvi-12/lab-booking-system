const service = require("../services/bookingService");
const asyncHandler = require("../utils/asyncHandler");

const createBooking = asyncHandler(async (req, res) => {
  const booking = await service.createBooking(
    req.userId,
    req.body
  );

  res.status(201).json({
    success: true,
    message: "Booking request submitted",
    data: booking
  });
});

const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await service.getMyBookings(req.userId);

  res.status(200).json({
    success: true,
    data: bookings
  });
});

const getAllBookings = asyncHandler(async (req, res) => {
  const bookings = await service.getAllBookings(req.query);

  res.status(200).json({
    success: true,
    data: bookings
  });
});

const updateBookingStatus = asyncHandler(async (req, res) => {
  const booking = await service.updateBookingStatus(
    req.params.id,
    req.body.status
  );

  res.status(200).json({
    success: true,
    message: "Booking status updated",
    data: booking
  });
});

const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await service.cancelBooking(
    req.params.id,
    req.userId
  );

  res.status(200).json({
    success: true,
    message: "Booking cancelled",
    data: booking
  });
});

module.exports = {
  createBooking,
  getMyBookings,
  getAllBookings,
  updateBookingStatus,
  cancelBooking
};