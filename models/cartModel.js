const { ObjectId } = require("mongodb");
const { connectDB } = require("../db");

async function addToCart(userId, productId) {
  const db = await connectDB();

  const cartCollection = db.collection("carts");

  const userObjectId = new ObjectId(userId);
  const productObjectId = new ObjectId(productId);

  const cart = await cartCollection.findOne({
    userId: userObjectId,
  });

  if (cart) {
    const itemIndex = cart.items.findIndex(
      (item) => item.productId.equals(productObjectId)
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

  return cartCollection.findOne({ userId: userObjectId });
}


async function removeFromCart(userId, productId) {
  const { ObjectId } = require("mongodb");
  const db = await connectDB();

  if (!ObjectId.isValid(userId) || !ObjectId.isValid(productId)) {
    throw new Error("Invalid user ID or product ID");
  }

  const result = await db.collection("carts").updateOne(
    { userId: new ObjectId(userId) },
    {
      $pull: {
        items: { productId: new ObjectId(productId) },
      },
    }
  );

  return result.modifiedCount > 0;
}


module.exports = { 
    addToCart,
    removeFromCart,
};