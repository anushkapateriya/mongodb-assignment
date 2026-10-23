const express = require("express");
const path = require("path");
const { connectDB } = require("./db");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, "frontend")));

// Product routes
app.use("/products", productRoutes);

//cart routes
app.use("/cart", cartRoutes);

// Order routes
app.use("/orders", orderRoutes);

app.use("/users", userRoutes);

async function startServer() {
  try {
    await connectDB();

    app.listen(3000, () => {
      console.log("Server running on http://localhost:3000");
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();
