// This page shows all doctors and lets an admin add a new one.

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar.jsx";
import api from "../api/axios.js";

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // form fields for adding a new doctor
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [qualification, setQualification] = useState("");
  const [department, setDepartment] = useState("");
  const [experience, setExperience] = useState("");
  const [consultationFee, setConsultationFee] = useState("");
  const [mobile, setMobile] = useState("");

  // check the logged-in user's role so we know whether to show the add form
  const savedUser = localStorage.getItem("user");
  const currentUser = savedUser ? JSON.parse(savedUser) : null;
  const isAdmin = currentUser && currentUser.role === "admin";

  useEffect(function () {
    fetchDoctors();
  }, []);

  async function fetchDoctors() {
    try {
      const response = await api.get("/doctors");
      setDoctors(response.data);
    } catch (error) {
      setErrorMessage("Could not load doctors.");
    }
  }

  async function handleAddDoctor(event) {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await api.post("/doctors", {
        name: name,
        email: email,
        qualification: qualification,
        department: department,
        experience: experience,
        consultationFee: consultationFee,
        mobile: mobile,
      });

      setSuccessMessage("Doctor added successfully!");

      // clear the form
      setName("");
      setEmail("");
      setQualification("");
      setDepartment("");
      setExperience("");
      setConsultationFee("");
      setMobile("");

      fetchDoctors();
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Could not add doctor.");
      }
    }
  }

  return (
    <div>
      <Navbar />

      <div className="page-content">
        {/* only admins can see and use the "add doctor" form */}
        {isAdmin && (
          <div>
            <h2>Add New Doctor</h2>

            {errorMessage && <p className="error-text">{errorMessage}</p>}
            {successMessage && <p className="success-text">{successMessage}</p>}

            <form className="inline-form" onSubmit={handleAddDoctor}>
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />

              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />

              <input
                type="text"
                placeholder="Qualification (e.g. MBBS, MD)"
                value={qualification}
                onChange={(event) => setQualification(event.target.value)}
                required
              />

              <input
                type="text"
                placeholder="Department (e.g. Cardiology)"
                value={department}
                onChange={(event) => setDepartment(event.target.value)}
                required
              />

              <input
                type="number"
                placeholder="Experience (years)"
                value={experience}
                onChange={(event) => setExperience(event.target.value)}
              />

              <input
                type="number"
                placeholder="Consultation Fee"
                value={consultationFee}
                onChange={(event) => setConsultationFee(event.target.value)}
                required
              />

              <input
                type="text"
                placeholder="Mobile"
                value={mobile}
                onChange={(event) => setMobile(event.target.value)}
                required
              />

              <button type="submit">Add Doctor</button>
            </form>
          </div>
        )}

        <h2>All Doctors</h2>

        {!isAdmin && errorMessage && <p className="error-text">{errorMessage}</p>}

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Department</th>
              <th>Qualification</th>
              <th>Experience</th>
              <th>Fee</th>
              <th>Mobile</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map(function (doctor) {
              return (
                <tr key={doctor._id}>
                  <td>{doctor.name}</td>
                  <td>{doctor.department}</td>
                  <td>{doctor.qualification}</td>
                  <td>{doctor.experience} yrs</td>
                  <td>{doctor.consultationFee}</td>
                  <td>{doctor.mobile}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Doctors;
