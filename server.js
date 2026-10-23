
const express = require("express");
const { connectDB } = require("./db");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");

const app = express();

app.use(express.json());

// Product routes
app.use("/products", productRoutes);

//cart routes
app.use("/cart", cartRoutes);

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
