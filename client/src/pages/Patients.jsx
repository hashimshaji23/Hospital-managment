// This page shows all patients and lets receptionist/admin add a new one.

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar.jsx";
import api from "../api/axios.js";

function Patients() {
  const [patients, setPatients] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // form fields for adding a new patient
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");
  const [bloodGroup, setBloodGroup] = useState("unknown");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  // load the patient list when the page first opens
  useEffect(function () {
    fetchPatients();
  }, []);

  async function fetchPatients() {
    try {
      const response = await api.get("/patients");
      setPatients(response.data);
    } catch (error) {
      setErrorMessage("Could not load patients. You may not have permission.");
    }
  }

  async function handleAddPatient(event) {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await api.post("/patients", {
        name: name,
        age: age,
        gender: gender,
        bloodGroup: bloodGroup,
        phone: phone,
        email: email,
        address: address,
      });

      setSuccessMessage("Patient added successfully!");

      // clear the form
      setName("");
      setAge("");
      setGender("male");
      setBloodGroup("unknown");
      setPhone("");
      setEmail("");
      setAddress("");

      // refresh the list to show the new patient
      fetchPatients();
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Could not add patient.");
      }
    }
  }

  return (
    <div>
      <Navbar />

      <div className="page-content">
        <h2>Add New Patient</h2>

        {errorMessage && <p className="error-text">{errorMessage}</p>}
        {successMessage && <p className="success-text">{successMessage}</p>}

        <form className="inline-form" onSubmit={handleAddPatient}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />

          <input
            type="number"
            placeholder="Age"
            value={age}
            onChange={(event) => setAge(event.target.value)}
            required
          />

          <select value={gender} onChange={(event) => setGender(event.target.value)}>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>

          <select value={bloodGroup} onChange={(event) => setBloodGroup(event.target.value)}>
            <option value="unknown">Unknown</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>

          <input
            type="text"
            placeholder="Phone"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email (optional)"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          <input
            type="text"
            placeholder="Address (optional)"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
          />

          <button type="submit">Add Patient</button>
        </form>

        <h2>All Patients</h2>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Blood Group</th>
              <th>Phone</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {patients.map(function (patient) {
              return (
                <tr key={patient._id}>
                  <td>{patient.name}</td>
                  <td>{patient.age}</td>
                  <td>{patient.gender}</td>
                  <td>{patient.bloodGroup}</td>
                  <td>{patient.phone}</td>
                  <td>{patient.email}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Patients;
