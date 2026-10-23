
const { connectDB } = require("../db");

// Create a new product
async function createProduct(req, res) {
  try {
    const { name, price, description, createdBy } = req.body;
    const { ObjectId } = require("mongodb");

    if (
        typeof name !== "string" ||
        name.trim() === "" ||
        typeof price !== "number" ||
        !Number.isFinite(price) ||
        price < 0
    ) {
        return res.status(400).json({
            message: "A valid product name and non-negative numeric price are required",
        });
        }

    if (!ObjectId.isValid(createdBy)) {
        return res.status(400).json({
            message: "Valid creator user ID is required",
        });
    }

    const db = await connectDB();

    const user = await db.collection("users").findOne({
        _id: new ObjectId(createdBy),
        });

        if (!user) {
        return res.status(404).json({
            message: "Creator user not found",
        });
    }

    const result = await db.collection("products").insertOne({
      name,
      price,
      description: description || "",
      createdAt: new Date(),
      createdBy: new ObjectId(createdBy),
    });

    res.status(201).json({
      message: "Product created successfully",
      productId: result.insertedId,
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
    const db = await connectDB();

    const products = await db
      .collection("products")
      .find({})
      .toArray();

    res.status(200).json(products);
  } catch (error) {
    console.error("Fetch products failed:", error.message);

    res.status(500).json({
      message: "Failed to fetch products",
    });
  }
}


async function fetchSingleProduct(req, res) {
  try {
    const { ObjectId } = require("mongodb");
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }

    const db = await connectDB();

    const product = await db.collection("products").findOne({
      _id: new ObjectId(id),
    });

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


async function updateProduct(req, res) {
  try {
    const { ObjectId } = require("mongodb");
    const { id } = req.params;
    const { name, price, description } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }

    if (
      (name !== undefined && typeof name !== "string") ||
      (price !== undefined && typeof price !== "number") ||
      (description !== undefined && typeof description !== "string")
    ) {
      return res.status(400).json({
        message: "Invalid product data",
      });
    }

    const updates = {};

    if (name !== undefined) updates.name = name;
    if (price !== undefined) updates.price = price;
    if (description !== undefined) updates.description = description;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: "Provide at least one field to update",
      });
    }

    const db = await connectDB();

    const result = await db.collection("products").updateOne(
      { _id: new ObjectId(id) },
      { $set: updates }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      message: "Product updated successfully",
    });
  } catch (error) {
    console.error("Update product failed:", error.message);

    res.status(500).json({
      message: "Failed to update product",
    });
  }
}

async function deleteProduct(req, res) {
  try {
    const { ObjectId } = require("mongodb");
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }

    const db = await connectDB();

    const result = await db.collection("products").deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
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
