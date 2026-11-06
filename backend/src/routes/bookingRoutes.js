const express = require("express");
const router = express.Router();

const { protect } = require("../middlewares/authMiddleware");
const allowRoles = require("../middlewares/roleMiddleware");

const {
  createBooking,
  getMyBookings,
  getAllBookings,
  updateBookingStatus,
  cancelBooking
} = require("../controllers/bookingController");

router.use(protect);

router.post("/", allowRoles("student"), createBooking);

router.get("/my", getMyBookings);

router.get("/", allowRoles("admin"), getAllBookings);

router.patch("/:id/status", allowRoles("admin"), updateBookingStatus);

router.patch("/:id/cancel", allowRoles("student"), cancelBooking);

module.exports = router;