const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    patient_name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    experience: {
      type: Number,
      required: true,
    },
    salary: {
      type: Number,
      required: true,
    },
    qualifications: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    works_in: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hospitals",
      },
    ],
  },
  {timestamps: true}
);

export const Doctors = mongoose.model("Doctors", doctorSchema);
