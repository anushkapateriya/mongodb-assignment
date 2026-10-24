
const mongoose = require("mongoose");
require("dotenv").config();

async function connectMongoose() {
  await mongoose.connect(process.env.MONGODB_URI, {
    dbName: "productDB",
  });

  console.log("Mongoose connected successfully!");
}

module.exports = { connectMongoose };
