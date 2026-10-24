
const mongoose = require("mongoose");
const User = require("./userModel");
const Product = require("./productModel");

const cartItemSchema = new mongoose.Schema(
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
      default: 1,
    },
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  items: {
    type: [cartItemSchema],
    default: [],
  },
});

const Cart = mongoose.model("Cart", cartSchema);

async function addToCart(userId, productId) {
  if (
    !mongoose.isValidObjectId(userId) ||
    !mongoose.isValidObjectId(productId)
  ) {
    throw new Error("Invalid user ID or product ID");
  }

  const user = await User.findUserByID(userId);

  if (!user) {
    throw new Error("User not found");
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = new Cart({
      userId,
      items: [{ productId, quantity: 1 }],
    });
  } else {
    const item = cart.items.find(
      (entry) => entry.productId.toString() === productId
    );

    if (item) {
      item.quantity += 1;
    } else {
      cart.items.push({ productId, quantity: 1 });
    }
  }

  await cart.save();

  return getCart(userId);
}

async function getCart(userId) {
  if (!mongoose.isValidObjectId(userId)) {
    throw new Error("Invalid user ID");
  }

  return Cart.findOne({ userId });
}

async function removeFromCart(userId, productId) {
  if (
    !mongoose.isValidObjectId(userId) ||
    !mongoose.isValidObjectId(productId)
  ) {
    throw new Error("Invalid user ID or product ID");
  }

  const cart = await Cart.findOne({ userId });

  if (!cart) {
    return false;
  }

  const originalLength = cart.items.length;

  cart.items = cart.items.filter(
    (item) => item.productId.toString() !== productId
  );

  if (cart.items.length === originalLength) {
    return false;
  }

  await cart.save();
  return true;
}

module.exports = {
  addToCart,
  getCart,
  removeFromCart,
};
