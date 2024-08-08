const mongoose = require("mongoose");

const HospitalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    pincode: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    Specializes_in: {
      type: String,
    },
  },
  {timestamps: true}
);

export const Hospitals = mongoose.model("Hospitals", HospitalSchema);
