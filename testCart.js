
const { removeFromCart } = require("./models/cartModel");
const { connectDB } = require("./db");
const { ObjectId } = require("mongodb");

async function testDeleteCartItem() {
  const userId = "6adb8e90c7ed0ef8ad2ca678";
  const productToDelete = "6adb945d8f815512303ed761";

  const deleted = await removeFromCart(userId, productToDelete);

  console.log("Item removed:", deleted);

  const db = await connectDB();
  const cart = await db.collection("carts").findOne({
    userId: new ObjectId(userId),
  });

  console.log("Cart after deleting the item:");
  console.dir(cart, { depth: null });
}

testDeleteCartItem()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Cart deletion test failed:", error.message);
    process.exit(1);
  });
