const { createUser, findUserByID } = require("./models/userModel");

async function testUserModel() {
  // 1. Insert a new user
  const userId = await createUser({
    name: "Test User",
    email: "testuser@example.com",
  });

  console.log("Created user ID:", userId.toString());

  // 2. Find the user using the ID
  const user = await findUserByID(userId.toString());

  console.log("Found user:", user);
}

testUserModel()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Test failed:", error.message);
    process.exit(1);
  });