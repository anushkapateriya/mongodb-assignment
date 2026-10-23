
const express = require("express");
const {
  placeOrder,
  getOrdersByUser,
} = require("../models/orderModel");

const router = express.Router();

// Place an order for a user
router.post("/:userId", async (req, res) => {
  try {
    const order = await placeOrder(req.params.userId);

    res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    const statusCode = error.message === "Cart is empty" ? 400 : 400;

    res.status(statusCode).json({
      message: error.message,
    });
  }
});

// Get all previous orders for a user
router.get("/:userId", async (req, res) => {
  try {
    const orders = await getOrdersByUser(req.params.userId);

    res.status(200).json({
      orders,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

module.exports = router;
