const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    type: {
      type: String,
      required: true,
      enum: [
        "Lab",
        "Projector",
        "Seminar Hall",
        "Device"
      ]
    },

    location: {
      type: String,
      required: true
    },

    capacity: {
      type: Number,
      required: true,
      min: 1
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resource", resourceSchema);