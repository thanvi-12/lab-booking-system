const Booking = require("../models/Booking");
const Resource = require("../models/Resource");

const createBooking = async (userId, data) => {
  const {
    resource,
    date,
    startTime,
    endTime,
    purpose
  } = data;

  if (!resource || !date || !startTime || !endTime || !purpose) {
    throw new Error("All booking fields are required");
  }

  const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;

  if (!timePattern.test(startTime) || !timePattern.test(endTime)) {
    throw new Error("Invalid time format. Use HH:MM");
  }

  if (startTime >= endTime) {
    throw new Error("End time must be after start time");
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error("Invalid date format");
  }

  const parsedDate = new Date(`${date}T00:00:00.000Z`);

  if (
    Number.isNaN(parsedDate.getTime()) ||
    parsedDate.toISOString().slice(0, 10) !== date
  ) {
    throw new Error("Invalid date");
  }

  const today = new Date().toISOString().slice(0, 10);

  if (date < today) {
    throw new Error("Cannot book a past date");
  }

  const foundResource = await Resource.findOne({
    _id: resource,
    isActive: true
  });

  if (!foundResource) {
    throw new Error("Resource not found or inactive");
  }

  const overlapping = await Booking.findOne({
    resource,
    date,
    status: "Approved",
    startTime: { $lt: endTime },
    endTime: { $gt: startTime }
  });

  if (overlapping) {
    throw new Error("This time slot is already booked");
  }

  return await Booking.create({
    user: userId,
    resource,
    date,
    startTime,
    endTime,
    purpose,
    status: "Pending"
  });
};

const getMyBookings = async (userId) => {
  return await Booking.find({ user: userId })
    .populate("resource")
    .sort({ createdAt: -1 });
};

const getAllBookings = async (filters) => {
  const query = {};

  if (filters.status) query.status = filters.status;
  if (filters.date) query.date = filters.date;
  if (filters.resource) query.resource = filters.resource;

  return await Booking.find(query)
    .populate("resource")
    .populate("user", "name email role")
    .sort({ createdAt: -1 });
};

const updateBookingStatus = async (bookingId, status) => {
  if (!["Approved", "Rejected"].includes(status)) {
    throw new Error("Invalid booking status");
  }

  const booking = await Booking.findById(bookingId);

  if (!booking) {
    throw new Error("Booking not found");
  }

  if (booking.status !== "Pending") {
    throw new Error("Only pending bookings can be reviewed");
  }

  if (status === "Approved") {
    const overlapping = await Booking.findOne({
      _id: { $ne: booking._id },
      resource: booking.resource,
      date: booking.date,
      status: "Approved",
      startTime: { $lt: booking.endTime },
      endTime: { $gt: booking.startTime }
    });

    if (overlapping) {
      throw new Error("Cannot approve: time slot already booked");
    }
  }

  booking.status = status;

  await booking.save();

  return booking;
};

const cancelBooking = async (bookingId, userId) => {
  const booking = await Booking.findById(bookingId);

  if (!booking) {
    throw new Error("Booking not found");
  }

  if (booking.user.toString() !== userId.toString()) {
    const error = new Error("You can cancel only your own bookings");
    error.statusCode = 403;
    throw error;
  }

  if (!["Pending", "Approved"].includes(booking.status)) {
    throw new Error("This booking cannot be cancelled");
  }

  booking.status = "Cancelled";

  await booking.save();

  return booking;
};

module.exports = {
  createBooking,
  getMyBookings,
  getAllBookings,
  updateBookingStatus,
  cancelBooking
};