const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    patient_name: {
      type: String,
      required: true,
    },
    diagnosed_with: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    blood_group: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    admitted_in: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospitals",
    },
  },
  {timestamps: true}
);

export const Patients = mongoose.model("Patients", patientSchema);
