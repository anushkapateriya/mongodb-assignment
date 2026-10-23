
const express = require("express");

const {
  addToCart,
  getCart,
  removeFromCart,
} = require("../models/cartModel");

const router = express.Router();

// Add a product to a user's cart
router.post("/:userId/items/:productId", async (req, res) => {
  try {
    const cart = await addToCart(
      req.params.userId,
      req.params.productId
    );

    res.status(200).json({
      message: "Product added to cart successfully",
      cart,
    });
  } catch (error) {
    const status =
      error.message === "User not found" ||
      error.message === "Product not found"
        ? 404
        : 400;

    res.status(status).json({
      message: error.message,
    });
  }
});

// Get a user's cart
router.get("/:userId", async (req, res) => {
  try {
    const cart = await getCart(req.params.userId);

    res.status(200).json({
      cart: cart || {
        userId: req.params.userId,
        items: [],
      },
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

// Delete a product from a user's cart
router.delete("/:userId/items/:productId", async (req, res) => {
  try {
    const { userId, productId } = req.params;

    const deleted = await removeFromCart(userId, productId);

    if (!deleted) {
      return res.status(404).json({
        message: "Cart item not found",
      });
    }

    res.status(200).json({
      message: "Cart item deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

module.exports = router;
