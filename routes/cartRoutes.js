
const express = require("express");
const { removeFromCart } = require("../models/cartModel");

const router = express.Router();

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
