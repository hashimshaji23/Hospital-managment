// This file contains simple CRUD logic for doctors.

import Doctor from "../models/Doctor.js";

// CREATE a new doctor
async function createDoctor(req, res) {
  try {
    const newDoctor = await Doctor.create(req.body);
    res.status(201).json(newDoctor);
  } catch (error) {
    res.status(500).json({ message: "Could not create doctor", error: error.message });
  }
}

// READ all doctors
async function getAllDoctors(req, res) {
  try {
    const doctors = await Doctor.find();
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ message: "Could not fetch doctors", error: error.message });
  }
}

// READ one doctor by ID
async function getDoctorById(req, res) {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      res.status(404).json({ message: "Doctor not found" });
      return;
    }

    res.status(200).json(doctor);
  } catch (error) {
    res.status(500).json({ message: "Could not fetch doctor", error: error.message });
  }
}

// UPDATE a doctor
async function updateDoctor(req, res) {
  try {
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedDoctor) {
      res.status(404).json({ message: "Doctor not found" });
      return;
    }

    res.status(200).json(updatedDoctor);
  } catch (error) {
    res.status(500).json({ message: "Could not update doctor", error: error.message });
  }
}

// DELETE a doctor
async function deleteDoctor(req, res) {
  try {
    const deletedDoctor = await Doctor.findByIdAndDelete(req.params.id);

    if (!deletedDoctor) {
      res.status(404).json({ message: "Doctor not found" });
      return;
    }

    res.status(200).json({ message: "Doctor deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Could not delete doctor", error: error.message });
  }
}

export { createDoctor, getAllDoctors, getDoctorById, updateDoctor, deleteDoctor };
