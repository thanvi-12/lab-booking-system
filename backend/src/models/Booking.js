const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    resource: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resource",
      required: true
    },

    date: {
      type: String,
      required: true
    },

    startTime: {
      type: String,
      required: true
    },

    endTime: {
      type: String,
      required: true
    },

    purpose: {
      type: String,
      required: true
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Approved",
        "Rejected",
        "Cancelled"
      ],
      default: "Pending"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);