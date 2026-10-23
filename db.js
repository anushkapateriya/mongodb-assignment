
const { MongoClient } = require("mongodb");
require("dotenv").config();

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is missing from the .env file");
}

const client = new MongoClient(uri);

let db;

async function connectDB() {
  if (db) {
    return db;
  }

  await client.connect();
  db = client.db("productDB");

  console.log("MongoDB connected successfully!");

  return db;
}

module.exports = { connectDB };
