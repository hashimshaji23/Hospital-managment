// This file defines what a "Doctor" record looks like in our database.

import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  qualification: {
    type: String,
    required: true,
  },
  // Kept simple as plain text for now (e.g. "Cardiology").
  // Later, once you are comfortable, this can become a link to a Department.
  department: {
    type: String,
    required: true,
  },
  experience: {
    type: Number,
    default: 0,
  },
  consultationFee: {
    type: Number,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

const Doctor = mongoose.model("Doctor", doctorSchema);

export default Doctor;
