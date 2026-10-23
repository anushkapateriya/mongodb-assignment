
const { placeOrder, getOrdersByUser } = require("./models/orderModel");

async function testOrders() {
  const userId = "6adb8e90c7ed0ef8ad2ca678";

  // Place an order using the user's current cart
  const order = await placeOrder(userId);

  console.log("Order placed successfully:");
  console.dir(order, { depth: null });

  // Retrieve the user's order history
  const orders = await getOrdersByUser(userId);

  console.log("Previous orders for this user:");
  console.dir(orders, { depth: null });
}

testOrders()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Order test failed:", error.message);
    process.exit(1);
  });
