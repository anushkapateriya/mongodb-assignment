
const express = require("express");

const {
  createProduct,
  fetchProducts,
  fetchSingleProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const router = express.Router();

// Create a product
router.post("/", createProduct);

// Fetch all products
router.get("/", fetchProducts);

// Fetch a single product by ID
router.get("/:id", fetchSingleProduct);

// Update a product by ID
router.put("/:id", updateProduct);

// delete a product by ID
router.delete("/:id", deleteProduct);

module.exports = router;
