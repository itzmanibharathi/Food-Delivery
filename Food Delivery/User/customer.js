// customer.js
import { db } from "../firebase.js";
import { ref, onValue, update, remove } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

document.addEventListener("DOMContentLoaded", () => {
  const tbody = document.querySelector("#ordersTable tbody");
  const timerIntervals = new Map();

  function clearTimer(key) {
    if (timerIntervals.has(key)) {
      clearInterval(timerIntervals.get(key));
      timerIntervals.delete(key);
    }
  }

  function cancelWindowMinutes(paymentMethod) {
    return paymentMethod === "cash" ? 2 : 10;
  }

  function startTimer(key, order, el) {
    clearTimer(key);
    const createdAt = order.createdAt || Date.now();
    const windowMin = cancelWindowMinutes(order.paymentMethod || "online");

    const tick = () => {
      if (order.status === "Delivered") {
        el.textContent = "--";
        return;
      }
      const diffMin = (Date.now() - createdAt) / (1000 * 60);
      const remaining = windowMin - diffMin;

      if (remaining <= 0) {
        el.textContent = "Ended";
        clearTimer(key);
      } else {
        el.textContent = `${remaining.toFixed(1)} min left`;
      }
    };

    tick();
    const iv = setInterval(tick, 1000);
    timerIntervals.set(key, iv);
  }

  function renderRow(key, order) {
    const itemsText = Array.isArray(order.items)
      ? order.items.map(i => i.name).join(", ")
      : order.items || "-";

    const totalVal = Number(order.total || 0);
    const totalText = `$${totalVal.toFixed(2)}`;

    const restaurantName =
      (Array.isArray(order.items) && order.items[0]?.hotelName) ||
      order.hotelName ||
      "-";

    const status = order.status || "Created";

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${escapeHtml(itemsText)}</td>
      <td>${escapeHtml(totalText)}</td>
      <td>${escapeHtml(restaurantName)}</td>
      <td id="status-${key}">${escapeHtml(status)}</td>
      <td id="timer-${key}">--</td>
      <td id="rating-${key}">
        ${order.rating ? escapeHtml(order.rating + " ⭐") : "—"}
      </td>
      <td id="feedback-${key}">
        ${order.feedback ? escapeHtml(order.feedback) : "—"}
      </td>
      <td id="actions-${key}"></td>
    `;

    // Timer
    const timerEl = tr.querySelector(`#timer-${key}`);
    startTimer(key, order, timerEl);

    // Action buttons
    const actionsTd = tr.querySelector(`#actions-${key}`);
    if (status !== "Delivered" && status !== "Cancelled") {
      const deliverBtn = document.createElement("button");
      deliverBtn.textContent = "Mark Delivered";
      deliverBtn.addEventListener("click", () => markDelivered(key, order));

      const cancelBtn = document.createElement("button");
      cancelBtn.textContent = "Cancel Order";
      cancelBtn.addEventListener("click", () => cancelOrder(key, order));

      actionsTd.appendChild(deliverBtn);
      actionsTd.appendChild(cancelBtn);
    }

    return tr;
  }

  function markDelivered(key, order) {
    clearTimer(key);

    const rating = prompt("Please give a rating (1-5):");
    if (!rating || isNaN(rating) || rating < 1 || rating > 5) {
      alert("Rating is required (1-5).");
      return;
    }
    const feedback = prompt("Optional feedback (press OK to skip):") || "";

    update(ref(db, "orders/" + key), {
      status: "Delivered",
      rating,
      feedback
    });
  }

  function cancelOrder(key, order) {
    clearTimer(key);
    const createdAt = order.createdAt || Date.now();
    const windowMin = cancelWindowMinutes(order.paymentMethod || "online");
    const diffMin = (Date.now() - createdAt) / (1000 * 60);

    if (diffMin > windowMin) {
      const fine = (Number(order.total) || 0) * 0.5;
      alert(`Cancel window exceeded. A fine of $${fine.toFixed(2)} applied.`);
      // You can store fine info in DB if needed:
      update(ref(db, "orders/" + key), { status: "Cancelled", fine });
    } else {
      alert("Order cancelled without fine.");
      update(ref(db, "orders/" + key), { status: "Cancelled" });
    }

    // After marking cancelled, remove order
    setTimeout(() => {
      remove(ref(db, "orders/" + key));
    }, 1500);
  }

  function escapeHtml(s) {
    if (s == null) return "";
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // Fetch all orders
  onValue(ref(db, "orders"), snapshot => {
    tbody.innerHTML = "";
    const rows = [];

    snapshot.forEach(child => {
      const key = child.key;
      const order = child.val() || {};
      rows.push(renderRow(key, order));
    });

    if (rows.length === 0) {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td colspan="8" class="center muted">No orders found</td>`;
      tbody.appendChild(tr);
    } else {
      rows.forEach(r => tbody.appendChild(r));
    }
  });
});
