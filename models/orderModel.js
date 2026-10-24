
const mongoose = require("mongoose");
const { getCart } = require("./cartModel");

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: {
      type: [orderItemSchema],
      required: true,
    },
    status: {
      type: String,
      enum: ["placed", "cancelled", "completed"],
      default: "placed",
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

// Place an order using all items in the user's cart
async function placeOrder(userId) {
  if (!mongoose.isValidObjectId(userId)) {
    throw new Error("Invalid user ID");
  }

  const cart = await getCart(userId);

  if (!cart || !cart.items || cart.items.length === 0) {
    throw new Error("Cart is empty");
  }

  const order = await Order.create({
    userId,
    items: cart.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    })),
    status: "placed",
  });

  // Empty the cart only after the order is saved
  cart.items = [];
  await cart.save();

  return order;
}

// Retrieve all orders belonging to one user
async function getOrdersByUser(userId) {
  if (!mongoose.isValidObjectId(userId)) {
    throw new Error("Invalid user ID");
  }

  return Order.find({ userId }).sort({ createdAt: -1 });
}

module.exports = {
  placeOrder,
  getOrdersByUser,
};
