// This file defines what a "Patient" record looks like in our database.

import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
    required: true,
  },
  bloodGroup: {
    type: String,
    default: "unknown",
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  address: {
    type: String,
  },
}, {
  // this automatically adds "createdAt" and "updatedAt" fields
  timestamps: true,
});

const Patient = mongoose.model("Patient", patientSchema);

export default Patient;
