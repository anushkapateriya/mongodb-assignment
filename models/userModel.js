const { connectDB } = require("../db");

// Insert a new user into MongoDB
async function createUser(userData) {
  const db = await connectDB();

  const result = await db.collection("users").insertOne({
    name: userData.name,
    email: userData.email,
    createdAt: new Date(),
  });

  return result.insertedId;
}

// Find a user by their MongoDB ID
async function findUserByID(userId) {
  const { ObjectId } = require("mongodb");

  if (!ObjectId.isValid(userId)) {
    return null;
  }

  const db = await connectDB();

  const user = await db.collection("users").findOne({
    _id: new ObjectId(userId),
  });

  return user;
}

module.exports = {
  createUser,
  findUserByID,
};