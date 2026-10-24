
const API_URL = "http://localhost:3000";

// Temporary demo user already present in your MongoDB database.
// Replace this with a different existing user ID if needed.
const USER_ID = "6adb8e90c7ed0ef8ad2ca678";

let products = [];

// Safely display text returned by the backend.
function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[char]);
}

// Switch between Products, Cart, and Orders.
async function showPage(page) {
  document.querySelectorAll(".page").forEach((section) => {
    section.classList.add("hidden");
  });

  document.getElementById(`${page}-page`).classList.remove("hidden");

  if (page === "products") await loadProducts();
  if (page === "cart") await loadCart();
  if (page === "orders") await loadOrders();
}

// Load all products from MongoDB through the backend.
async function loadProducts() {
  const container = document.getElementById("products-list");
  container.innerHTML = "<p>Loading products...</p>";

  try {
    const response = await fetch(`${API_URL}/products`);

    if (!response.ok) {
      throw new Error("Could not load products.");
    }

    products = await response.json();

    if (products.length === 0) {
      container.innerHTML = "<p>No products available yet.</p>";
      return;
    }

    container.innerHTML = products.map((product) => `
      <article class="product-card">
        <h3>${escapeHTML(product.name)}</h3>
        <p>${escapeHTML(product.description || "No description available.")}</p>
        <p class="price">₹${Number(product.price).toFixed(2)}</p>
        <button onclick="addToCart('${escapeHTML(product._id)}')">
          Add to Cart
        </button>
      </article>
    `).join("");
  } catch (error) {
    container.innerHTML = `<p>${escapeHTML(error.message)}</p>`;
  }
}

// Add a product to the current user's cart.

async function addToCart(productId) {
  try {
    const response = await fetch(
      `${API_URL}/cart/${USER_ID}/items/${encodeURIComponent(productId)}`,
      { method: "POST" }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Could not add product.");
    }

    alert("Product added to cart!");

    // Open the Cart page after successfully adding the product.
    await showPage("cart");
  } catch (error) {
    alert(error.message);
  }
}


// Load the user's cart and display each item.
async function loadCart() {
  const container = document.getElementById("cart-list");
  const orderButton = document.getElementById("place-order-button");

  container.innerHTML = "<p>Loading cart...</p>";
  orderButton.disabled = true;

  try {
    const [cartResponse, productsResponse] = await Promise.all([
      fetch(`${API_URL}/cart/${USER_ID}`),
      fetch(`${API_URL}/products`),
    ]);

    if (!cartResponse.ok || !productsResponse.ok) {
      throw new Error("Could not load the cart.");
    }

    const cartData = await cartResponse.json();
    products = await productsResponse.json();

    const items = cartData.cart?.items || [];

    if (items.length === 0) {
      container.innerHTML = "<p>Your cart is empty.</p>";
      return;
    }

    orderButton.disabled = false;

    let total = 0;

    const cards = items.map((item) => {
      const product = products.find(
        (p) => p._id === item.productId
      );

      if (!product) {
        return `
          <article class="cart-card">
            <p>Product unavailable</p>
            <p>Quantity: ${Number(item.quantity)}</p>
            <button class="danger-button"
              onclick="removeFromCart('${escapeHTML(item.productId)}')">
              Remove
            </button>
          </article>
        `;
      }

      const quantity = Number(item.quantity);
      const price = Number(product.price);

      total += price * quantity;

      return `
        <article class="cart-card">
          <h3>${escapeHTML(product.name)}</h3>
          <p>Price: ₹${price.toFixed(2)}</p>
          <p>Quantity: ${quantity}</p>
          <p>Subtotal: ₹${(price * quantity).toFixed(2)}</p>
          <div class="card-actions">
            <button class="danger-button"
              onclick="removeFromCart('${escapeHTML(item.productId)}')">
              Remove
            </button>
          </div>
        </article>
      `;
    });

    cards.push(`
      <article class="cart-card">
        <h3>Cart Total</h3>
        <p class="price">₹${total.toFixed(2)}</p>
      </article>
    `);

    container.innerHTML = cards.join("");
  } catch (error) {
    container.innerHTML = `<p>${escapeHTML(error.message)}</p>`;
  }
}

// Remove an item from the cart.
async function removeFromCart(productId) {
  try {
    const response = await fetch(
      `${API_URL}/cart/${USER_ID}/items/${encodeURIComponent(productId)}`,
      { method: "DELETE" }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Could not remove item.");
    }

    await loadCart();
  } catch (error) {
    alert(error.message);
  }
}

// Place an order using all items in the cart.
async function placeOrder() {
  const button = document.getElementById("place-order-button");

  if (!confirm("Are you sure you want to place this order?")) {
    return;
  }

  button.disabled = true;

  try {
    const response = await fetch(`${API_URL}/orders/${USER_ID}`, {
      method: "POST",
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Could not place order.");
    }

    alert("Order placed successfully!");
    await loadCart();
    await showPage("orders");
  } catch (error) {
    alert(error.message);
  } finally {
    button.disabled = false;
  }
}

// Display previous orders for the current user.
async function loadOrders() {
  const container = document.getElementById("orders-list");
  container.innerHTML = "<p>Loading orders...</p>";

  try {
    const [ordersResponse, productsResponse] = await Promise.all([
      fetch(`${API_URL}/orders/${USER_ID}`),
      fetch(`${API_URL}/products`),
    ]);

    if (!ordersResponse.ok || !productsResponse.ok) {
      throw new Error("Could not load orders.");
    }

    const orderData = await ordersResponse.json();
    products = await productsResponse.json();

    const orders = orderData.orders || [];

    if (orders.length === 0) {
      container.innerHTML = "<p>You have no orders yet.</p>";
      return;
    }

    container.innerHTML = orders.map((order) => {
      const itemsHTML = order.items.map((item) => {
        const product = products.find(
          (p) => p._id === item.productId
        );

        return `
          <li>
            ${escapeHTML(product?.name || "Unavailable product")}
            — Quantity: ${Number(item.quantity)}
          </li>
        `;
      }).join("");

      return `
        <article class="order-card">
          <h3>Order #${escapeHTML(order._id)}</h3>
          <p>Status: ${escapeHTML(order.status)}</p>
          <p>Date: ${escapeHTML(
            order.createdAt
              ? new Date(order.createdAt).toLocaleString()
              : "Unknown"
          )}</p>
          <ul>${itemsHTML}</ul>
        </article>
      `;
    }).join("");
  } catch (error) {
    container.innerHTML = `<p>${escapeHTML(error.message)}</p>`;
  }
}

// Load products when the page first opens.
document.addEventListener("DOMContentLoaded", () => {
  showPage("products");
});
