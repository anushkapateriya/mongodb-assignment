
const { ObjectId } = require("mongodb");
const { connectDB } = require("../db");

// Insert a new user into MongoDB
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

  const db = await connectDB();

  const result = await db.collection("users").insertOne({
    name: userData.name.trim(),
    email: userData.email.trim().toLowerCase(),
    createdAt: new Date(),
  });

  return result.insertedId;
}

// Find a user by their MongoDB ID
async function findUserByID(userId) {
  if (!ObjectId.isValid(userId)) {
    return null;
  }

  const db = await connectDB();

  return db.collection("users").findOne({
    _id: new ObjectId(userId),
  });
}

module.exports = {
  createUser,
  findUserByID,
};
