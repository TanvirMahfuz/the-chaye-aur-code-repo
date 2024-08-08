const mongoose = require("mongoose");

const medicalRecordSchema = new mongoose.Schema({}, {timestamps: true});

export const MedicalReports = mongoose.model(
  "MedicalReports",
  medicalRecordSchema
);
