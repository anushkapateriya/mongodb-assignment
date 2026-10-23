
const express = require("express");
const {
  createUser,
  findUserByID,
} = require("../models/userModel");

const router = express.Router();

// Create a new user
router.post("/", async (req, res) => {
  try {
    const userId = await createUser(req.body);

    res.status(201).json({
      message: "User created successfully",
      userId: userId.toString(),
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

// Find a user by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await findUserByID(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch user",
    });
  }
});

module.exports = router;
