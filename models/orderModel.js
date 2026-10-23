
const { ObjectId } = require("mongodb");
const { connectDB } = require("../db");

// Place an order using all items in the user's cart
async function placeOrder(userId) {
  if (!ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  const db = await connectDB();
  const carts = db.collection("carts");
  const orders = db.collection("orders");
  const userObjectId = new ObjectId(userId);

  const cart = await carts.findOne({ userId: userObjectId });

  if (!cart || !cart.items || cart.items.length === 0) {
    throw new Error("Cart is empty");
  }

  const order = {
    userId: userObjectId,
    items: cart.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    })),
    createdAt: new Date(),
    status: "placed",
  };

  const result = await orders.insertOne(order);

  // Empty the cart only after the order is saved
  await carts.updateOne(
    { _id: cart._id },
    { $set: { items: [] } }
  );

  return {
    orderId: result.insertedId,
    ...order,
  };
}

// Retrieve all orders belonging to one user
async function getOrdersByUser(userId) {
  if (!ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  const db = await connectDB();

  return db.collection("orders")
    .find({ userId: new ObjectId(userId) })
    .sort({ createdAt: -1 })
    .toArray();
}

module.exports = {
  placeOrder,
  getOrdersByUser,
};
