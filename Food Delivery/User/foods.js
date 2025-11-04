import { db } from "../firebase.js";
import { ref, onValue, push } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

const foodTableBody = document.querySelector("#foodTable tbody");
const cartTableBody = document.querySelector("#cartTable tbody");
const cartTotalSpan = document.getElementById("cartTotal");
const checkoutBtn = document.getElementById("checkoutBtn");
const paymentModal = document.getElementById("paymentModal");
const payMsg = document.getElementById("payMsg");
const cashBtn = document.getElementById("cashBtn");
const onlineBtn = document.getElementById("onlineBtn");

const customerName = localStorage.getItem("customerName");
const customerEmail = localStorage.getItem("customerEmail");
document.getElementById("customerName").textContent = customerName;

let cart = [];

// Load foods
onValue(ref(db, "foods"), (snapshot) => {
  foodTableBody.innerHTML = "";
  snapshot.forEach((child) => {
    const food = child.val();
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><button>Add</button></td>
      <td>${food.name}</td>
      <td>${food.type}</td>
      <td>${food.price}</td>
      <td><img src="${food.imageURL}" width="60"/></td>
    `;
    tr.querySelector("button").onclick = () => addToCart(food);
    foodTableBody.appendChild(tr);
  });
});

// Add to cart
function addToCart(food) {
  cart.push(food);
  renderCart();
}

function renderCart() {
  cartTableBody.innerHTML = "";
  let total = 0;
  cart.forEach((item, i) => {
    total += item.price;
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.name}</td>
      <td>${item.price}</td>
      <td><button>Remove</button></td>
    `;
    tr.querySelector("button").onclick = () => {
      cart.splice(i, 1);
      renderCart();
    };
    cartTableBody.appendChild(tr);
  });
  cartTotalSpan.textContent = total.toFixed(2);
}

// Checkout
checkoutBtn.onclick = () => {
  if (cart.length === 0) {
    alert("Cart is empty");
    return;
  }
  paymentModal.style.display = "block";
  payMsg.textContent = "Choose payment method:";
};

cashBtn.onclick = () => placeOrder("Cash");
onlineBtn.onclick = () => placeOrder("Online");

function placeOrder(method) {
  const order = {
    customerName,
    email: customerEmail,
    items: cart,
    total: parseFloat(cartTotalSpan.textContent),
    payment: method,
    status: "Pending",
    time: Date.now(),
    rating: null,
    feedback: null
  };
  push(ref(db, "orders"), order);
  alert("Order placed successfully!");
  cart = [];
  renderCart();
  paymentModal.style.display = "none";
}
