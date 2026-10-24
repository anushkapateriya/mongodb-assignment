
const mongoose = require("mongoose");
const Product = require("../models/productModel");
const User = require("../models/userModel");

// Create a new product
async function createProduct(req, res) {
  try {
    const { name, price, description, createdBy } = req.body;

    if (
      typeof name !== "string" ||
      name.trim() === "" ||
      typeof price !== "number" ||
      !Number.isFinite(price) ||
      price < 0
    ) {
      return res.status(400).json({
        message:
          "A valid product name and non-negative numeric price are required",
      });
    }

    if (!mongoose.isValidObjectId(createdBy)) {
      return res.status(400).json({
        message: "Valid creator user ID is required",
      });
    }

    const user = await User.findUserByID(createdBy);

    if (!user) {
      return res.status(404).json({
        message: "Creator user not found",
      });
    }

    const product = await Product.create({
      name: name.trim(),
      price,
      description: description || "",
      createdBy,
    });

    res.status(201).json({
      message: "Product created successfully",
      productId: product._id,
    });
  } catch (error) {
    console.error("Create product failed:", error.message);

    res.status(500).json({
      message: "Failed to create product",
    });
  }
}

// Fetch all products
async function fetchProducts(req, res) {
  try {
    const products = await Product.find();

    res.status(200).json(products);
  } catch (error) {
    console.error("Fetch products failed:", error.message);

    res.status(500).json({
      message: "Failed to fetch products",
    });
  }
}

// Fetch one product by ID
async function fetchSingleProduct(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Fetch single product failed:", error.message);

    res.status(500).json({
      message: "Failed to fetch product",
    });
  }
}

// Update a product
async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const { name, price, description } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }

    if (
      (name !== undefined &&
        (typeof name !== "string" || name.trim() === "")) ||
      (price !== undefined &&
        (typeof price !== "number" ||
          !Number.isFinite(price) ||
          price < 0)) ||
      (description !== undefined && typeof description !== "string")
    ) {
      return res.status(400).json({
        message: "Invalid product data",
      });
    }

    const updates = {};

    if (name !== undefined) updates.name = name.trim();
    if (price !== undefined) updates.price = price;
    if (description !== undefined) updates.description = description;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: "Provide at least one field to update",
      });
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Update product failed:", error.message);

    res.status(400).json({
      message: error.message,
    });
  }
}

// Delete a product
async function deleteProduct(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete product failed:", error.message);

    res.status(500).json({
      message: "Failed to delete product",
    });
  }
}

module.exports = {
  createProduct,
  fetchProducts,
  fetchSingleProduct,
  updateProduct,
  deleteProduct,
};
