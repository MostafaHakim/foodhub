const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Restaurant = require("../models/Restaurant");
const router = express.Router();

// Seller Registration
router.post("/register-seller", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      restaurantName,
      restaurantAddress,
      cuisineType,
    } = req.body;

    // Basic validation
    if (
      !name ||
      !email ||
      !password ||
      !phone ||
      !restaurantName ||
      !restaurantAddress ||
      !cuisineType
    ) {
      return res.status(400).json({ message: "Please provide all required fields." });
    }


    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      userType: "seller",
    });

    await user.save();

    // Create new restaurant
    const restaurant = new Restaurant({
      name: restaurantName,
      address: restaurantAddress,
      cuisine: cuisineType,
      owner: user._id,
    });

    await restaurant.save();

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, userType: user.userType },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType,
      },
      restaurant,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong during seller registration." });
  }
});


// লগিন
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, userType: user.userType },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

module.exports = router;
