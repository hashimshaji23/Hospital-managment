// This file defines what a "Department" looks like in our database.
// Example: Cardiology, Neurology, General Medicine.

import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  code: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
}, {
  timestamps: true,
});

const Department = mongoose.model("Department", departmentSchema);

export default Department;
