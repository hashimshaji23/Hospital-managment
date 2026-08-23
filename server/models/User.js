// This file defines what a "User" looks like in our database.
// Every login (Admin, Doctor, Receptionist, Patient, etc.) is a User.

import mongoose from "mongoose";
import bcrypt from "bcrypt";

// A schema is just a blueprint that says what fields a User has.
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // no two users can have the same email
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    // only these values are allowed for role
    enum: ["admin", "doctor", "receptionist", "nurse", "pharmacist", "patient"],
    default: "patient",
  },
  phone: {
    type: String,
  },
});

// Before a user is saved to the database, we hash (scramble) their password.
// This runs automatically every time .save() or .create() is called.
userSchema.pre("save", async function (next) {
  // if password was not changed, skip hashing again
  if (!this.isModified("password")) {
    next();
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// This is a helper function we can call on any user to check their password.
// Example: user.comparePassword("1234")
userSchema.methods.comparePassword = async function (enteredPassword) {
  const isMatch = await bcrypt.compare(enteredPassword, this.password);
  return isMatch;
};

// Create the model from the schema and export it so other files can use it.
const User = mongoose.model("User", userSchema);

export default User;
