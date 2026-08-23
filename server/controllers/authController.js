// This file contains the logic for registering and logging in users.

import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

// REGISTER a new user
async function registerUser(req, res) {
  try {
    // get the data sent from the frontend (or Postman)
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const role = req.body.role;

    // basic validation: make sure required fields are filled
    if (!name || !email || !password) {
      res.status(400).json({ message: "Please fill all required fields." });
      return;
    }

    // check if a user with this email already exists
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      res.status(400).json({ message: "This email is already registered." });
      return;
    }

    // create the new user (password gets hashed automatically, see User.js)
    const newUser = await User.create({
      name: name,
      email: email,
      password: password,
      role: role, // if not provided, it defaults to "patient"
    });

    // create a login token for this new user
    const token = generateToken(newUser._id, newUser.role);

    res.status(201).json({
      message: "Registration successful",
      token: token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
}

// LOGIN an existing user
async function loginUser(req, res) {
  try {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
      res.status(400).json({ message: "Please enter email and password." });
      return;
    }

    // find the user by email
    const user = await User.findOne({ email: email });
    if (!user) {
      res.status(400).json({ message: "Invalid email or password." });
      return;
    }

    // check if the password matches (see comparePassword in User.js)
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      res.status(400).json({ message: "Invalid email or password." });
      return;
    }

    // create a login token
    const token = generateToken(user._id, user.role);

    res.status(200).json({
      message: "Login successful",
      token: token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
}

export { registerUser, loginUser };
