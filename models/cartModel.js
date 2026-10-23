
const { ObjectId } = require("mongodb");
const { connectDB } = require("../db");

async function addToCart(userId, productId) {
  if (!ObjectId.isValid(userId) || !ObjectId.isValid(productId)) {
    throw new Error("Invalid user ID or product ID");
  }

  const db = await connectDB();
  const userObjectId = new ObjectId(userId);
  const productObjectId = new ObjectId(productId);
  const cartCollection = db.collection("carts");

  // Check that the user and product exist
  const user = await db.collection("users").findOne({
    _id: userObjectId,
  });

  if (!user) {
    throw new Error("User not found");
  }

  const product = await db.collection("products").findOne({
    _id: productObjectId,
  });

  if (!product) {
    throw new Error("Product not found");
  }

  const cart = await cartCollection.findOne({
    userId: userObjectId,
  });

  if (cart) {
    const items = cart.items || [];

    const itemIndex = items.findIndex((item) =>
      item.productId.equals(productObjectId)
    );

    if (itemIndex >= 0) {
      await cartCollection.updateOne(
        { _id: cart._id },
        { $inc: { [`items.${itemIndex}.quantity`]: 1 } }
      );
    } else {
      await cartCollection.updateOne(
        { _id: cart._id },
        {
          $push: {
            items: {
              productId: productObjectId,
              quantity: 1,
            },
          },
        }
      );
    }
  } else {
    await cartCollection.insertOne({
      userId: userObjectId,
      items: [
        {
          productId: productObjectId,
          quantity: 1,
        },
      ],
    });
  }

  return getCart(userId);
}

async function getCart(userId) {
  if (!ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  const db = await connectDB();

  return db.collection("carts").findOne({
    userId: new ObjectId(userId),
  });
}

async function removeFromCart(userId, productId) {
  if (!ObjectId.isValid(userId) || !ObjectId.isValid(productId)) {
    throw new Error("Invalid user ID or product ID");
  }

  const db = await connectDB();

  const result = await db.collection("carts").updateOne(
    { userId: new ObjectId(userId) },
    {
      $pull: {
        items: {
          productId: new ObjectId(productId),
        },
      },
    }
  );

  return result.modifiedCount > 0;
}

module.exports = {
  addToCart,
  getCart,
  removeFromCart,
};
