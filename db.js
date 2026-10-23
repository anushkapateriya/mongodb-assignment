
const { MongoClient } = require("mongodb");
require("dotenv").config();

const client = new MongoClient(process.env.MONGODB_URI);

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


