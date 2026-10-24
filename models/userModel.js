
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

// Insert a new user
async function createUser(userData) {
  if (
    !userData ||
    typeof userData.name !== "string" ||
    userData.name.trim() === "" ||
    typeof userData.email !== "string" ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email.trim())
  ) {
    throw new Error("A valid name and email are required");
  }

  const user = await User.create({
    name: userData.name.trim(),
    email: userData.email.trim().toLowerCase(),
  });

  return user._id;
}

// Find a user by their MongoDB ID
async function findUserByID(userId) {
  if (!mongoose.isValidObjectId(userId)) {
    return null;
  }

  return User.findById(userId);
}

module.exports = {
  createUser,
  findUserByID,
};
