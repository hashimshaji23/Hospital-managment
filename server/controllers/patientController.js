// This file contains simple CRUD (Create, Read, Update, Delete) logic for patients.

import Patient from "../models/Patient.js";

// CREATE a new patient
async function createPatient(req, res) {
  try {
    const newPatient = await Patient.create(req.body);
    res.status(201).json(newPatient);
  } catch (error) {
    res.status(500).json({ message: "Could not create patient", error: error.message });
  }
}

// READ all patients
async function getAllPatients(req, res) {
  try {
    const patients = await Patient.find();
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ message: "Could not fetch patients", error: error.message });
  }
}

// READ one patient by ID
async function getPatientById(req, res) {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      res.status(404).json({ message: "Patient not found" });
      return;
    }

    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ message: "Could not fetch patient", error: error.message });
  }
}

// UPDATE a patient
async function updatePatient(req, res) {
  try {
    const updatedPatient = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // this makes it return the UPDATED patient, not the old one
    );

    if (!updatedPatient) {
      res.status(404).json({ message: "Patient not found" });
      return;
    }

    res.status(200).json(updatedPatient);
  } catch (error) {
    res.status(500).json({ message: "Could not update patient", error: error.message });
  }
}

// DELETE a patient
async function deletePatient(req, res) {
  try {
    const deletedPatient = await Patient.findByIdAndDelete(req.params.id);

    if (!deletedPatient) {
      res.status(404).json({ message: "Patient not found" });
      return;
    }

    res.status(200).json({ message: "Patient deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Could not delete patient", error: error.message });
  }
}

export { createPatient, getAllPatients, getPatientById, updatePatient, deletePatient };
